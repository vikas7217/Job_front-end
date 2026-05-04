import React from "react";

import ArrowRightWhite from "../../assets/right-up.png";
import ArrowRightDark from "../../assets/right-up-dark.png";

interface NOCCode {
  _id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  skillLevel?: string;
  subCategory?: string;
}

interface NocCardProps {
  details: {
    _id: string;
    code: string;
    title: string;
    description: string;
    category: string;
    skillLevel?: string;
    subCategory?: string;
  }[];
handleNOCSelect(NOCCode: NOCCode): void;
}

const NocCard: React.FC<NocCardProps> = ({ details,handleNOCSelect }) => {
  

  return (
    <>
      {details.length > 0 &&
        details.map((details,index) => (
          <>
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white max-w-sm display flex"  key={details._id}
                      onClick={() => handleNOCSelect(details)}
                      // className={`search-result-item group p-5 border border-gray-200 rounded-xl ${
                      //   isUpdating
                      //     ? "cursor-not-allowed opacity-50"
                      //     : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                      // } animate-search-result-enter`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select NOC code ${details.code}: ${details.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleNOCSelect(details);
                        }
                      }}>
              <div>
                <p className="text-gray-500 text-sm">{details?.code}</p>

                <h2 className="text-fuchsia-700 font-semibold text-lg mt-1">
                  {details?.title}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {details?.category}
                  </span>
                  <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                    Skill Level: {details?.skillLevel}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mt-3">
                  {details?.description}
                </p>
              </div>
              <div>
                <div className="absolute top-4 right-4 transition-all duration-300">
                  <div className="bg-yellow-400 w-6 h-6 flex items-center justify-center rounded-md shadow-md">
                    <img
                      className="w-4 h-4  block group-hover:hidden"
                      src={ArrowRightWhite}
                      alt="image"
                    />

                    <img
                      className="w-4 h-4 hidden group-hover:block"
                      src={ArrowRightDark}
                      alt="image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </>
  );
};

export default NocCard;
