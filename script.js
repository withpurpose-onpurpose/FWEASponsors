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
        // Title and button wrapper
        const headerRow = document.createElement("div");
        headerRow.style.display = "flex";
        headerRow.style.justifyContent = "space-between";
        headerRow.style.alignItems = "center";
        headerRow.style.marginTop = "30px";

        const title = document.createElement("h3");
        title.textContent = `${select.options[select.selectedIndex].text} - ${cols} Column Grid`;
        title.style.margin = "0";

        const instruction = document.createElement("p");
        instruction.textContent = "Use Snipping Tool or Snagit to screenshot this layout.";
        instruction.style.fontSize = "0.9em";
        instruction.style.margin = "4px 0 12px 0";
        instruction.style.color = "#555";

        headerRow.appendChild(title);
        gridContainer.appendChild(headerRow);
        gridContainer.appendChild(instruction);

        // Grid wrapper
        const gridWrapper = document.createElement("div");
        gridWrapper.className = "fweaSponsorGallery variant";
        gridWrapper.style.display = "grid";
        gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridWrapper.style.gap = "6px";
        gridWrapper.style.maxWidth = "800px";
        gridWrapper.style.margin = "10px auto 40px";
        gridWrapper.style.alignItems = "center";

        imageLinks.forEach((linkEl) => {
          const link = document.createElement("a");
          link.href = linkEl.href;
          link.target = "_blank";
          link.style.display = "block";
          link.style.padding = "2px";

          const img = linkEl.querySelector("img");
          if (img) {
            const clone = document.createElement("img");
            clone.src = img.src;
            clone.alt = img.alt || "Sponsor logo";
            clone.style.display = "block";
            clone.style.width = "100%";
            clone.style.maxHeight = "70px";
            clone.style.objectFit = "contain";
            clone.style.margin = "0 auto";
            link.appendChild(clone);
          }

          gridWrapper.appendChild(link);
        });

        gridContainer.appendChild(gridWrapper);
      });
    })
    .catch((err) => console.error("Failed to fetch grid:", err));
}

