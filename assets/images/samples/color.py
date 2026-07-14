import os
import cv2
import numpy as np
from skimage.exposure import match_histograms


def color_matrix_estimation(
    source_pixels,
    reference_pixels,
    sample_ratio=0.05,
    seed=42
):
    """
    学习 source -> reference 的 3×3 颜色变换矩阵。

    source_pixels:    (N, 3)，待校正图像像素
    reference_pixels: (N, 3)，参考图像像素
    """
    if source_pixels.shape != reference_pixels.shape:
        raise ValueError(
            f"像素数量不一致："
            f"{source_pixels.shape} 和 {reference_pixels.shape}"
        )

    num_pixels = source_pixels.shape[0]

    if num_pixels == 0:
        return None

    sample_num = max(10, int(num_pixels * sample_ratio))
    sample_num = min(sample_num, num_pixels)

    rng = np.random.default_rng(seed)
    indices = rng.choice(
        num_pixels,
        size=sample_num,
        replace=False
    )

    source_sample = source_pixels[indices]
    reference_sample = reference_pixels[indices]

    try:
        color_matrix = (
            np.linalg.pinv(source_sample)
            @ reference_sample
        )
    except np.linalg.LinAlgError:
        return None

    return color_matrix


def color_correction(image, color_matrix):
    """
    对 RGB 浮点图像应用 3×3 颜色矩阵。

    image: (H, W, 3)，范围 [0, 1]
    """
    if color_matrix is None:
        return image.copy()

    corrected = image @ color_matrix
    corrected = np.clip(corrected, 0.0, 1.0)

    return corrected


def align_color(
    source_path,
    reference_path,
    output_path,
    crop_border=80,
    sample_ratio=0.05,
    use_histogram_matching=True
):
    """
    将 source 图像的颜色对齐到 reference 图像。

    source_path:
        待校正图像。

    reference_path:
        颜色参考图像。

    output_path:
        校正结果保存路径。
    """
    source_bgr = cv2.imread(
        source_path,
        cv2.IMREAD_COLOR
    )
    reference_bgr = cv2.imread(
        reference_path,
        cv2.IMREAD_COLOR
    )

    if source_bgr is None:
        raise FileNotFoundError(
            f"无法读取待校正图像：{source_path}"
        )

    if reference_bgr is None:
        raise FileNotFoundError(
            f"无法读取参考图像：{reference_path}"
        )

    if source_bgr.shape != reference_bgr.shape:
        raise ValueError(
            f"两张图像尺寸必须一致，当前为：\n"
            f"source: {source_bgr.shape}\n"
            f"reference: {reference_bgr.shape}"
        )

    source = cv2.cvtColor(
        source_bgr,
        cv2.COLOR_BGR2RGB
    ).astype(np.float32) / 255.0

    reference = cv2.cvtColor(
        reference_bgr,
        cv2.COLOR_BGR2RGB
    ).astype(np.float32) / 255.0

    height, width = source.shape[:2]

    # 中心区域用于估计颜色矩阵，减少边缘错位影响
    if (
        crop_border > 0
        and height > 2 * crop_border
        and width > 2 * crop_border
    ):
        source_crop = source[
            crop_border:-crop_border,
            crop_border:-crop_border
        ]

        reference_crop = reference[
            crop_border:-crop_border,
            crop_border:-crop_border
        ]
    else:
        print("图像尺寸较小，不进行中心裁剪")
        source_crop = source
        reference_crop = reference

    source_pixels = source_crop.reshape(-1, 3)
    reference_pixels = reference_crop.reshape(-1, 3)

    # 学习 source -> reference 的颜色矩阵
    color_matrix = color_matrix_estimation(
        source_pixels,
        reference_pixels,
        sample_ratio=sample_ratio
    )

    if color_matrix is None:
        raise RuntimeError("颜色矩阵估计失败")

    print("颜色变换矩阵：")
    print(color_matrix)

    # 将颜色矩阵应用到完整 source 图像
    corrected = color_correction(
        source,
        color_matrix
    )

    if use_histogram_matching:
        # 进一步将亮度和颜色分布匹配到参考图像
        corrected = match_histograms(
            corrected,
            reference,
            channel_axis=-1
        )

        corrected = np.clip(
            corrected,
            0.0,
            1.0
        )

    corrected_uint8 = (
        corrected * 255.0 + 0.5
    ).astype(np.uint8)

    output_bgr = cv2.cvtColor(
        corrected_uint8,
        cv2.COLOR_RGB2BGR
    )

    output_dir = os.path.dirname(output_path)

    if output_dir:
        os.makedirs(
            output_dir,
            exist_ok=True
        )

    success = cv2.imwrite(
        output_path,
        output_bgr
    )

    if not success:
        raise RuntimeError(
            f"图像保存失败：{output_path}"
        )

    print(f"颜色对齐结果已保存至：{output_path}")


if __name__ == "__main__":
    # 待校正图像：最终修改的是这张图
    source_path = "F:/Project/Code/assets/images/samples/gt/024_00121_patch_13.png"

    # 参考图像：希望 source 的颜色接近这张图
    reference_path = "F:/Project/Code/assets/images/samples/024_00121_patch_13.png"

    # 输出结果
    output_path = "./source_aligned.png"

    align_color(
        source_path=source_path,
        reference_path=reference_path,
        output_path=output_path,
        crop_border=80,
        sample_ratio=0.05,
        use_histogram_matching=True
    )