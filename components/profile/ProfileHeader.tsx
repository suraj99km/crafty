import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, BadgeCheck, XCircle } from "lucide-react";

interface ProfileHeaderProps {
  artist: {
    profile_picture?: string;
    name: string;
    email_address: string;
    gov_id: string;
  };
  uploadStatus: "idle" | "uploading";
  handleProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ artist, uploadStatus, handleProfileImageUpload }) => {
  return (
    <Card className="shadow-lg bg-white rounded-2xl border border-gray-200">
      <CardContent className="flex items-center gap-4 p-4 sm:p-6">
        <div className="relative group">
          <img
            src={artist.profile_picture || "/placeholder.png"}
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full shadow-md object-cover"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageUpload}
            />
            {uploadStatus === "uploading" ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <RefreshCw className="w-6 h-6" />
                <span className="text-xs ml-2">Change Photo</span>
              </>
            )}
          </label>
        </div>

        <div className="space-y-1 w-full">
          <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
            ArtistID
          </span>
          <h2 className="text-lg font-bold text-gray-900 truncate">{artist.name}</h2>
          <p className="pb-1 text-sm text-gray-600 truncate">{artist.email_address}</p>
          <div className="flex items-center gap-1 text-xs font-medium">
            {artist.gov_id === "verified" ? (
              <>
                <BadgeCheck className="text-green-500 w-4 h-4" />
                <span className="text-green-600">Verified</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500 w-4 h-4" />
                <span className="text-red-600">Verification Pending</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;