import { BrandInfo } from "@/models/Brand";
import { FC } from "react";
import MedCard from "../SearchMedicines/MedCard";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
const AvailableBrandCards: FC<{
  brandFetchedData: BrandInfo[];
}> = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = props.brandFetchedData.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(props.brandFetchedData.length / recordsPerPage);
  const array = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
  const pages = array.filter((page) => page > 0 && page <= nPages);
  if (props.brandFetchedData && props.brandFetchedData.length === 0) {
    return (
      <div className="flex justify-center align-middle">No Item Found</div>
    );
  }
  return (
    <div className="flex flex-col justify-center align-middle mt-6">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2">
      {/* <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-3 gap-5"> */}
        {props.brandFetchedData &&
          records.map((medicine) => (
            <MedCard medicine={medicine} key={medicine.Brand.id} />
          ))}
      </div>
      <nav className="mt-10  pb-3">
        <ul className="flex items-center justify-center">
          {currentPage !== 1 && (
            <li
              className="px-2 py-2 text-xl hover:rounded-full hover:text-white hover:bg-c1 duration-300"
              onClick={prevPage}
            >
              <a className="page-link">
                <AiOutlineArrowLeft />
              </a>
            </li>
          )}
          {currentPage === 1 && (
            <li className="px-2 py-2 text-xl text-opacity-30 hover:rounded-full hover:text-white hover:bg-gray-400 duration-300">
              <a className="page-link" aria-disabled>
                <AiOutlineArrowLeft />
              </a>
            </li>
          )}
          {pages.map((page) => (
            <li key={page}>
              <a
                className={
                  page === currentPage
                    ? "px-4 py-2 text-xl text-white rounded-full bg-c3 font-bold "
                    : "px-4 py-2 text-xl hover:rounded-full hover:bg-c1 hover:text-white duration-300"
                }
                onClick={() => setPage(page)}
              >
                {page}
              </a>
            </li>
          ))}
          {currentPage !== nPages && (
            <li className="px-2 py-2 text-xl hover:rounded-full hover:text-white hover:bg-c1 duration-300">
              <a className="page-link" onClick={nextPage}>
                <AiOutlineArrowRight />
              </a>
            </li>
          )}
          {currentPage === nPages && (
            <li className="px-2 py-2 text-xl text-opacity-30 hover:rounded-full hover:text-white hover:bg-gray-400 duration-300">
              <a className="page-link" aria-disabled>
                <AiOutlineArrowRight />
              </a>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
  function setPage(page: number) {
    setCurrentPage(page);
  }
  function nextPage() {
    if (currentPage < nPages) {
      setCurrentPage(currentPage + 1);
    }
  }
  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
};

export default AvailableBrandCards;
