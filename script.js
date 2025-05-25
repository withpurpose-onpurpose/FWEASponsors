// Option B: Load images normally and allow html2canvas to try capturing them directly

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
      const imageLinks = tempDiv.querySelectorAll("a img");

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

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download this Grid as PNG";
        downloadBtn.className = "download-button";

        const gridWrapper = document.createElement("div");
        gridWrapper.className = "fweaSponsorGallery variant";
        gridWrapper.style.display = "grid";
        gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridWrapper.style.gap = "4px";
        gridWrapper.style.margin = "10px 0";

        imageLinks.forEach((imgEl) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imgEl.src;
          img.style.width = "100%";
          img.style.maxHeight = "80px";
          img.style.objectFit = "contain";
          gridWrapper.appendChild(img);
        });

        downloadBtn.onclick = () => downloadGridAsImage(gridWrapper);

        gridContainer.appendChild(wrapperRow);
        gridContainer.appendChild(gridWrapper);
        wrapperRow.appendChild(downloadBtn);
      });
    })
    .catch((err) => console.error("Failed to fetch grid:", err));
}

function downloadGridAsImage(container) {
  html2canvas(container, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: null
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "sponsor-grid.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }).catch((err) => {
    console.error("Download failed:", err);
  });
}
