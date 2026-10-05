import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyProfile, updateMyProfile } from "../../services/profile.service";
import { Button } from "../../components/ui/button";

const emptyProfile = {
  careerInterests: [],
  preferredRoles: [],
  preferredLocations: [],
  experienceLevel: "fresher",
  skills: [],
};

export default function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();

        if (response.data.data) {
          setProfile({
            careerInterests: response.data.data.careerInterests || [],
            preferredRoles: response.data.data.preferredRoles || [],
            preferredLocations:
              response.data.data.preferredLocations || [],
            experienceLevel:
              response.data.data.experienceLevel || "fresher",
            skills: response.data.data.skills || [],
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleTextChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleExperienceChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      experienceLevel: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateMyProfile(profile);

      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Career Profile
          </h1>

          <p className="mt-2 text-muted-foreground">
            Tell CareerIQ AI about your career preferences so we can
            personalize your job search.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
        >
          {/* Career Interests */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Career Interests
            </label>

            <input
              type="text"
              value={profile.careerInterests.join(", ")}
              onChange={(e) =>
                handleTextChange("careerInterests", e.target.value)
              }
              placeholder="AI/ML, Data Science, Backend Development"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-muted-foreground">
              Separate multiple interests with commas.
            </p>
          </div>

          {/* Preferred Roles */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Preferred Roles
            </label>

            <input
              type="text"
              value={profile.preferredRoles.join(", ")}
              onChange={(e) =>
                handleTextChange("preferredRoles", e.target.value)
              }
              placeholder="SDE, Data Analyst, AI Engineer"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Preferred Locations */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Preferred Locations
            </label>

            <input
              type="text"
              value={profile.preferredLocations.join(", ")}
              onChange={(e) =>
                handleTextChange("preferredLocations", e.target.value)
              }
              placeholder="Pune, Mumbai, Remote"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Experience Level
            </label>

            <select
              value={profile.experienceLevel}
              onChange={handleExperienceChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="fresher">Fresher</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3+ years">3+ years</option>
            </select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Skills
            </label>

            <input
              type="text"
              value={profile.skills.join(", ")}
              onChange={(e) =>
                handleTextChange("skills", e.target.value)
              }
              placeholder="Python, React, MongoDB, SQL"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-muted-foreground">
              Separate multiple skills with commas.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}