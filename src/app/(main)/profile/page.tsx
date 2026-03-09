import { UserProfile } from "@/components/server/UserProfile";
import { Suspense } from "react";
import LoadingComponent from "../loading";

export default function UserPage() {
    return(
        <Suspense fallback={<LoadingComponent></LoadingComponent>}>
        <UserProfile></UserProfile>
        </Suspense>
    );
}