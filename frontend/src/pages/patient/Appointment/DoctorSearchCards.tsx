import { FC } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { SearchDoctorInfo } from "@/models/DoctorSchema";
import DoctorSearchCard from "./DoctorSearchCard";

const DoctorSearchCards: FC<{
  doctorFetchedData: SearchDoctorInfo;
  currentPage: number;
  recordsPerPage: number;
  setCurrentPage: (page: number) => void;
}> = (props) => {
  const { currentPage, setCurrentPage } = props;
  console.log(props.doctorFetchedData);
  const records = props.doctorFetchedData.Doctors;
  const nPages = Math.ceil(props.doctorFetchedData.totalCount / props.recordsPerPage);
  const array = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
  const pages = array.filter((page) => page > 0 && page <= nPages);
  if (props.doctorFetchedData && props.doctorFetchedData.totalCount=== 0) {
    return (
      <div className="flex justify-center align-middle">No Doctor Found</div>
    );
  }
  console.log(props.doctorFetchedData);
  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function nextPage() {
    if (currentPage < nPages) {
      setCurrentPage(currentPage + 1);
    }
  }
  return (
    <div className="relative h-[50vh]">
      <div className="grid lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-3 mt-3 gap-5">
        {props.doctorFetchedData &&
          records.map((doctor, index) => (
            <DoctorSearchCard doctor={doctor} key={index} />
          ))}
      </div>
      <nav className="absolute bottom-[-200px]  w-full pb-3">
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
                onClick={() => setCurrentPage(page)}
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
};
export default DoctorSearchCards;
