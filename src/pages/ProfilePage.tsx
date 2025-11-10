import { UserProfile } from "@clerk/clerk-react";

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <UserProfile path="/profile" routing="path" />
    </div>
  );
}