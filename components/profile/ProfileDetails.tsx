import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";

interface ArtistProfileDetailsProps {
  artist: {
    tagline?: string;
    instagram?: string;
    portfolio?: string;
    other_social?: string;
    bio?: string;
  };
  setArtist: (artist: any) => void;
  handleUpdate: (field: string, value: string) => void;
}

const EditableField = ({
  label,
  field,
  value,
  setEditing,
  editing,
  setArtist,
  handleUpdate,
}: {
  label: string;
  field: string;
  value?: string;
  setEditing: (field: string | null) => void;
  editing: string | null;
  setArtist: (artist: any) => void;
  handleUpdate: (field: string, value: string) => void;
}) => (
  <div className="relative">
    <h4 className="text-xs font-medium text-gray-600 mb-1">{label}</h4>
    {editing === field ? (
      <div className="relative">
        <Input
          value={value || ""}
          onChange={(e) => setArtist((prev: any) => ({ ...prev, [field]: e.target.value }))}
          onBlur={() => handleUpdate(field, value || "")}
          autoFocus
          className="pr-10"
        />
        <button
          className="absolute top-[-10px] right-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
          onClick={() => setEditing(null)}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <p className="text-gray-700 truncate">{value || `No ${label.toLowerCase()} added`}</p>
        <button
          className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
          onClick={() => setEditing(field)}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

const ArtistProfileDetails: React.FC<ArtistProfileDetailsProps> = ({
  artist,
  setArtist,
  handleUpdate,
}) => {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Tagline */}
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardContent className="p-4 sm:p-6 relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Tagline</h3>
          {editing === "tagline" ? (
            <Input
              value={artist.tagline || ""}
              onChange={(e) => setArtist({ ...artist, tagline: e.target.value })}
              onBlur={() => handleUpdate("tagline", artist.tagline || "")}
              autoFocus
            />
          ) : (
            <p className="italic font-medium text-gray-700">
              {artist.tagline || "No tagline provided"}
            </p>
          )}
          <button
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            onClick={() => setEditing("tagline")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Social Links</h3>
          <EditableField
            label="Instagram"
            field="instagram"
            value={artist.instagram}
            editing={editing}
            setEditing={setEditing}
            setArtist={setArtist}
            handleUpdate={handleUpdate}
          />
          <EditableField
            label="Portfolio"
            field="portfolio"
            value={artist.portfolio}
            editing={editing}
            setEditing={setEditing}
            setArtist={setArtist}
            handleUpdate={handleUpdate}
          />
          <EditableField
            label="Other Social"
            field="other_social"
            value={artist.other_social}
            editing={editing}
            setEditing={setEditing}
            setArtist={setArtist}
            handleUpdate={handleUpdate}
          />
        </CardContent>
      </Card>

      {/* My Story */}
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardContent className="p-4 sm:p-6 relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">My Story</h3>
          {editing === "bio" ? (
            <Textarea
              value={artist.bio || ""}
              onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
              onBlur={() => handleUpdate("bio", artist.bio || "")}
              autoFocus
              rows={6}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{artist.bio || "No bio added yet."}</p>
          )}
          <button
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            onClick={() => setEditing("bio")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistProfileDetails;