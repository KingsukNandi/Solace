"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Zod Schema for Form Validation
const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be at most 100"),
  gender: z.string().min(1, "Gender is required"),
  height: z
    .number()
    .min(50, "Height must be at least 50 cm")
    .max(250, "Height must be at most 250 cm"),
  weight: z
    .number()
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight must be at most 300 kg"),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),
  mentalHealthHistory: z.array(z.string()).optional(),
  stressLevel: z.string().min(1, "Stress level is required"),
  sleepPatterns: z.string().min(1, "Sleep patterns are required"),
  deviceType: z.string().min(1, "Device type is required"),
  deviceID: z.string().optional(),
  syncFrequency: z.string().min(1, "Sync frequency is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  notificationPreferences: z.array(z.string()).optional(),
});

// type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Page(){
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm(
  {
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      mentalHealthHistory: [],
      notificationPreferences: [],
    },
  });

  const onSubmit = () => {
    console.log("Form Data Submitted:", data);
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    console.log("User  logged out");
    // Add logout logic here (e.g., clear session, redirect to login page)
    alert("Logged out successfully!");
  };

  return (
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-[#f6f6f6] p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                {...register("age", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                {...register("gender")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="text-red- 500 text-sm">{errors.gender.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input
                {...register("height", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your height"
              />
              {errors.height && (
                <p className="text-red-500 text-sm">{errors.height.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                {...register("weight", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your weight"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-[#f6f6f6] p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-4">Health Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Medical History
              </label>
              <textarea
                {...register("medicalHistory")}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your medical history"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Current Medications
              </label>
              <textarea
                {...register("currentMedications")}
                className="w-full p-2 border rounded-lg"
                placeholder="List your current medications"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Allergies</label>
              <textarea
                {...register("allergies")}
                className="w-full p-2 border rounded-lg"
                placeholder="List any allergies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Mental Health History
              </label>
              <Controller
                control={control}
                name="mentalHealthHistory"
                render={({ field }) => (
                  <select
                    {...field}
                    multiple
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Anxiety">Anxiety</option>
                    <option value="Depression">Depression</option>
                    <option value="Bipolar Disorder">Bipolar Disorder</option>
                    <option value="None">None</option>
                  </select>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Stress Level</label>
              <select
                {...register("stressLevel")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select stress level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.stressLevel && (
                <p className="text-red-500 text-sm">
                  {errors.stressLevel.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Sleep Patterns
              </label>
              <select
                {...register("sleepPatterns")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select average hours of sleep</option>
                <option value="Less than 5">Less than 5</option>
                <option value="5-7">5-7</option>
                <option value="More than 7">More than 7</option>
              </select>
              {errors.sleepPatterns && (
                <p className="text-red-500 text-sm">
                  {errors.sleepPatterns.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Wearable Device Information */}
        <div className="bg-[#f6f6f6] p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-4">
            Wearable Device Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Device Type</label>
              <select
                {...register("deviceType")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select device type</option>
                <option value="Fitbit">Fitbit</option>
                <option value="Apple Watch">Apple Watch</option>
                <option value="Garmin">Garmin</option>
                <option value="Other">Other</option>
              </select>
              {errors.deviceType && (
                <p className="text-red-500 text-sm">
                  {errors.deviceType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Device ID</label>
              <input
                {...register("deviceID")}
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your device ID (if applicable)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Sync Frequency
              </label>
              <select
                {...register("syncFrequency")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select sync frequency</option>
                <option value="Every 1 hour">Every 1 hour</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Daily">Daily</option>
              </select>
              {errors.syncFrequency && (
                <p className="text-red-500 text-sm">
                  {errors.syncFrequency.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-[#f6f6f6] p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Notification Preferences
              </label>
              <div className="flex flex-col">
                <label>
                  <input
                    type="checkbox"
                    {...register("notificationPreferences")}
                    value="Email"
                  />
                  Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    {...register("notificationPreferences")}
                    value="SMS"
                  />
                  SMS
                </label>
                <label>
                  <input
                    type="checkbox"
                    {...register("notificationPreferences")}
                    value="Push Notifications"
                  />
                  Push Notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit and Logout Button */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};
