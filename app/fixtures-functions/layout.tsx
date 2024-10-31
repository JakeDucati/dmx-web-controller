import Link from "next/link";

export default function FixturesFunctionsLayout() {
    return (
        <div>
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