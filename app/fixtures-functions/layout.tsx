import Link from "next/link";

export default function FixturesFunctionsLayout() {
    return (
        <div className="w-full fixed top-[64px] flex items-center justify-center gap-10">
            <Link href={"/fixtures-functions"}>
                Regular View
            </Link>
            <Link href={"/fixtures-functions/dmx-view"}>
                DMX View
            </Link>
            <Link href={"/fixtures-functions/3d-view"}>
                3D View
            </Link>
        </div>
    );
}