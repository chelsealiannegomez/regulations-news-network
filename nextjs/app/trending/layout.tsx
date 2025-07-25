import HomeLayout from "../home/layout";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <HomeLayout>{children}</HomeLayout>; // Reuse HomeLayout so that NavBar doesn't rerender
}
