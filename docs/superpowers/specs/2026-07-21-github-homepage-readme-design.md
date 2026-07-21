# GitHub Homepage README Design

## Goal

Create a repository homepage README that mirrors the GS-RealBlur project page in static Markdown and update the page's Code link to the `youngmchan/GS-RealBlur` repository.

## README Structure

1. Centered title, authors, affiliation, and links to the project page, paper PDF, and repository.
2. Abstract copied from the project page.
3. `What Makes GS-RealBlur Different?` with the existing acquisition comparison figure.
4. `Method Overview` with the existing pipeline figure.
5. `Experiments` with the NAFNet cross-dataset table and the corresponding `more-metric-visual.png` qualitative comparison. The README uses this one representative static table-and-image pair in place of the page carousels.
6. OOD evaluation and BPR ablation summaries, including their existing static tables and the BPR illustration.
7. Dataset-sample note linking to the interactive project page rather than attempting to replicate the draggable comparison widgets.

## Link Policy

- README resource links use `https://youngmchan.github.io/GS-RealBlur/`, `assets/paper/GS-RealBlur.pdf`, and `https://github.com/youngmchan/GS-RealBlur`.
- The webpage Code button uses `https://github.com/youngmchan/GS-RealBlur`.

## Verification

- Add a content test requiring `README.md`, the project-page link, the NAFNet static table caption, the representative qualitative image, and the new repository URL.
- Run the existing page and asset tests plus the new README assertions.
