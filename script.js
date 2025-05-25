// Load image grid with inline links, with multiple column layout options

window.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadGridBtn");
  loadBtn.addEventListener("click", handleGenerate);

  const infoBox = document.createElement("div");
  infoBox.id = "sourceInfo";
  infoBox.className = "info-box";
  document.getElementById("gridOutput").before(infoBox);
});

function handleGenerate() {
  const select = document.getElementById("chapterSelect");
  const galleryId = select.value;
  const chapterName = select.options[select.selectedIndex].text;
  const url = `https://mms.fwea.org/slideshows/slick_feed.php?org_id=FWEA&ban=${galleryId}&speed=5&view_feed=Y`;

  const infoText = `These logos are coming from Photo Gallery ${galleryId} in the FWEA Content Manager → Slide Show Manager module.`;
  document.getElementById("sourceInfo").textContent = infoText;

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
        const sectionWrapper = document.createElement("div");
        sectionWrapper.className = "grid-section";

        // Layout Title and Tip
        const header = document.createElement("h3");
        header.textContent = `${chapterName} – ${cols} Column Grid`;
        sectionWrapper.appendChild(header);

        const tip = document.createElement("p");
        tip.className = "tip";
        tip.textContent = "Tip: Use Snipping Tool or Snagit to screenshot the desired layout.";
        sectionWrapper.appendChild(tip);

        // Border box container
        const borderedBox = document.createElement("div");
        borderedBox.className = "border-box";

        // Thank You Message
        const thanks = document.createElement("div");
        thanks.className = "thankyou";
        thanks.textContent = `Thank you to our ${chapterName} Sponsors!`;
        borderedBox.appendChild(thanks);

        // Grid Container
        const gridWrapper = document.createElement("div");
        gridWrapper.className = "fweaSponsorGallery variant";
        gridWrapper.style.display = "grid";
        gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridWrapper.style.gap = "4px";
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

        borderedBox.appendChild(gridWrapper);
        sectionWrapper.appendChild(borderedBox);
        gridContainer.appendChild(sectionWrapper);
      });
    })
    .catch((err) => console.error("Failed to fetch sponsor logos:", err));
}
