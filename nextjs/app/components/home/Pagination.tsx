import { useState, useEffect } from "react";
import type { PaginationProps } from "@/lib/types";

export default function Pagination({
    totalPages,
    currentPage,
    setCurrentPage,
    totalArticles,
}: PaginationProps) {
    const [leftDisabled, setLeftDisabled] = useState<boolean>(true);
    const [rightDisabled, setRightDisabled] = useState<boolean>(false);

    const NUM_ARTICLES_PER_PAGE = 4;

    useEffect(() => {
        if (currentPage === 1) {
            setLeftDisabled(true);
        } else {
            setLeftDisabled(false);
        }
        if (currentPage === totalPages) {
            setRightDisabled(true);
        } else {
            setRightDisabled(false);
        }
    }, [currentPage, totalPages]);

    const handleLeftClick = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleRightClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <div className="mx-auto flex">
            <p>
                Showing{" "}
                {currentPage * NUM_ARTICLES_PER_PAGE -
                    NUM_ARTICLES_PER_PAGE +
                    1}{" "}
                -{" "}
                {currentPage < totalPages
                    ? `${currentPage * NUM_ARTICLES_PER_PAGE}`
                    : `${totalArticles}`}{" "}
                of {totalArticles}
            </p>
            <button
                onClick={handleLeftClick}
                disabled={leftDisabled}
                className={
                    leftDisabled
                        ? "text-gray-400 mx-3 cursor-not-allowed"
                        : "text-black mx-3 cursor-pointer"
                }
            >
                &lt;
            </button>
            <button
                onClick={handleRightClick}
                disabled={rightDisabled}
                className={
                    rightDisabled
                        ? "text-gray-400 px-2 cursor-not-allowed"
                        : "text-black px-2 cursor-pointer"
                }
            >
                &gt;
            </button>
        </div>
    );
}
