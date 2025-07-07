type PaginationProps = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Pagination({
    totalPages,
    currentPage,
    setCurrentPage,
}: PaginationProps) {
    const handleClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="mx-auto">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={
                        currentPage === page
                            ? "mx-5 font-bold text-xl"
                            : "mx-5 text-xl"
                    }
                    onClick={() => handleClick(page)}
                >
                    {page}
                </button>
            ))}
        </div>
    );
}
