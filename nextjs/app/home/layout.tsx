import NavBar from "../components/home/NavBar";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavBar />
            <main>{children}</main>
        </>
    );
}
