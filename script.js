// Option B Revised: Load image grid with inline links, disable html2canvas download due to CORS

window.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadGridBtn");
  loadBtn.addEventListener("click", handleGenerate);
});

function handleGenerate() {
  const select = document.getElementById("chapterSelect");
  const galleryId = select.value;
  const chapterName = select.options[select.selectedIndex].text;
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
        const section = document.createElement("div");
        section.style.border = "1px solid #5d9f44";
        section.style.padding = "12px";
        section.style.marginBottom = "24px";

        const header = document.createElement("h3");
        header.textContent = `${chapterName} - ${cols} Column Grid`;
        header.style.marginBottom = "4px";
        section.appendChild(header);

        const tip = document.createElement("p");
        tip.textContent = "Tip: Use Snipping Tool or Snagit to screenshot the desired layout.";
        tip.style.fontSize = "0.9em";
        tip.style.color = "#444";
        tip.style.marginBottom = "8px";
        section.appendChild(tip);

        const thanks = document.createElement("div");
        thanks.textContent = `Thank you to our ${chapterName} Sponsors!`;
        thanks.style.fontFamily = "Poppins, sans-serif";
        thanks.style.fontSize = "16px";
        thanks.style.color = "#086db6";
        thanks.style.textAlign = "center";
        thanks.style.marginBottom = "8px";
        section.appendChild(thanks);

        const gridWrapper = document.createElement("div");
        gridWrapper.className = "fweaSponsorGallery variant";
        gridWrapper.style.display = "grid";
        gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridWrapper.style.gap = "6px";
        gridWrapper.style.margin = "auto";
        gridWrapper.style.maxWidth = "960px";

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

        section.appendChild(gridWrapper);
        gridContainer.appendChild(section);
      });
    })
    .catch((err) => console.error("Failed to fetch grid:", err));
}
