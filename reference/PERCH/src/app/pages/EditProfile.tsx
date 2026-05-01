import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Camera } from "lucide-react";
import { currentUser } from "../data";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [imageInput, setImageInput] = useState("");

  const handleSave = () => {
    // Update the currentUser data
    currentUser.name = name;
    currentUser.bio = bio;
    if (imageInput) {
      currentUser.avatar = imageInput;
    }

    // Navigate back to profile
    navigate("/profile");
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleImageChange = () => {
    if (imageInput && imageInput.trim() !== "") {
      setAvatar(imageInput);
    }
  };

  return (
    <div className="min-h-full bg-white pb-20">
      <header className="px-4 py-3 sticky top-0 bg-white z-10 border-b border-gray-100 flex items-center justify-between">
        <button onClick={handleCancel} className="p-1 rounded-full transition-transform hover:scale-110">
          <X size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg tracking-tight">Edit Profile</h1>
        <button
          onClick={handleSave}
          className="text-sm text-black hover:text-gray-600 transition-colors"
        >
          Save
        </button>
      </header>

      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <div className="w-full space-y-2 mb-4">
            <Input
              type="text"
              placeholder="Enter image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="text-sm"
            />
            <button
              onClick={handleImageChange}
              className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Change profile photo
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs text-gray-500 tracking-wide mb-2">
              Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 tracking-wide mb-2">
              Bio
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full min-h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
