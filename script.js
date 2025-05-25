// Option B Revised: Load image grid with inline links, disable html2canvas download due to CORS

window.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadGridBtn");
  loadBtn.addEventListener("click", handleGenerate);
});

function handleGenerate() {
  const select = document.getElementById("chapterSelect");
  const galleryId = select.value;
  const url = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const imageLinks = tempDiv.querySelectorAll("a");

      const layoutOptions = [1, 2, 3, 4, 5];
      const gridContainer = document.getElementById("gridOutput");
      gridContainer.innerHTML = "";

      layoutOptions.forEach((cols) => {
        const wrapperRow = document.createElement("div");
        wrapperRow.style.display = "flex";
        wrapperRow.style.alignItems = "center";
        wrapperRow.style.justifyContent = "space-between";

        const title = document.createElement("h3");
        title.textContent = `${select.options[select.selectedIndex].text} - ${cols} Column Grid`;
        wrapperRow.appendChild(title);

        const note = document.createElement("p");
        note.textContent = "Tip: Use Snipping Tool or Snagit to screenshot the desired layout.";
        note.style.fontSize = "0.9em";
        note.style.margin = "4px 0 12px 0";
        note.style.color = "#444";

        const gridWrapper = document.createElement("div");
        gridWrapper.className = "fweaSponsorGallery variant";
        gridWrapper.style.display = "grid";
        gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridWrapper.style.gap = "4px";
        gridWrapper.style.margin = "10px 0";
        gridWrapper.style.maxWidth = "1000px";
        gridWrapper.style.marginInline = "auto";

        imageLinks.forEach((linkEl) => {
          const link = document.createElement("a");
          link.href = linkEl.href;
          link.target = "_blank";
          link.style.display = "block";
          link.style.padding = "2px";
          link.style.boxSizing = "border-box";

          const img = linkEl.querySelector("img");
          if (img) {
            const clone = document.createElement("img");
            clone.src = img.src;
            clone.alt = img.alt || "Sponsor logo";
            clone.style.display = "block";
            clone.style.width = "100%";
            clone.style.maxHeight = "80px";
            clone.style.objectFit = "contain";
            clone.style.margin = "0 auto";
            link.appendChild(clone);
          }

          gridWrapper.appendChild(link);
        });

        gridContainer.appendChild(wrapperRow);
        gridContainer.appendChild(note);
        gridContainer.appendChild(gridWrapper);
      });
    })
    .catch((err) => console.error("Failed to fetch grid:", err));
}
