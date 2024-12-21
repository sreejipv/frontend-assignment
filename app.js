const itemsPerPage = 5;
const visiblePages = 10;
let currentPage = 1;
let fundingData = [];
let renderingData = [];
let pagescount = [];
let pagesList = [];
let startingPoint = 0;
let endpoint = 10;

const apiUrl =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

const fetchData = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error`);
    }
    fundingData = await response.json();
    document.getElementById("loading").style.display = "none";
    document.getElementById("main").style.display = "flex";
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  document.getElementById("loading").style.display = "flex";
  document.getElementById("main").style.display = "none";
  await fetchData();
  renderingData = fundingData.slice(0, 5);
  setPagination();
  renderTable();
  console.log("pagesList:", pagesList);
})();

function setPagination() {
  pagescount = Math.ceil(fundingData.length / itemsPerPage);
  const startPage =
    Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, pagescount);

  pagesList = Array.from(
    {
      length: pagescount,
    },
    (_, index) => index + 1
  ).slice(startPage - 1, endPage);

  if (currentPage === 1) {
    document.getElementById("prevButton").style.display = "none";
  } else {
    document.getElementById("prevButton").style.display = "inline";
  }

  if (currentPage === pagescount) {
    document.getElementById("nextButton").style.display = "none";
  } else {
    document.getElementById("nextButton").style.display = "inline";
  }

  document.getElementById("pagination").innerHTML = `
        <ul>
        ${pagesList
          .map(
            (item) =>
              `<li class="${
                currentPage === item ? "active" : ""
              }" onclick="handlePageClick(${item})">${item}</li>`
          )
          .join("")}
        </ul>
    `;
}

const renderTable = () => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  renderingData = fundingData.slice(startIndex, endIndex);

  document.getElementById("tablerows").innerHTML = renderingData
    .map(
      (item, index) =>
        `<tr>
            <td>${startIndex + index + 1}</td>
            <td>${item["percentage.funded"]}</td>
            <td>${item["amt.pledged"]}</td>
        </tr>`
    )
    .join("");
};

function handleNext() {
  if (currentPage < pagescount) {
    currentPage++;
    renderTable();
    setPagination();
  }
}

function handlePrev() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    setPagination();
  }
}

function handlePageClick(number) {
  currentPage = number;
  setPagination();
  renderTable();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    handleNext();
  }
  if (event.key === "ArrowLeft") {
    handlePrev();
  }
});
