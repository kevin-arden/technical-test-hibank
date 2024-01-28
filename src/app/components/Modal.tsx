"use client";
import React, { useState } from "react";
import Button from "./Button";

export interface FormData {
  fullName: string;
  email: string;
  birthdate: string;
  phone: string;
  age: string;
}

export type SelectedData = {
  index: number | null;
  data: FormData;
};

export const Modal = ({
  closeModal,
  editData,
  setData,
}: {
  closeModal: () => void;
  editData: SelectedData;
  setData: React.Dispatch<React.SetStateAction<FormData[]>>;
}) => {
  const [formData, setFormData] = useState<FormData>(
    editData?.data ?? {
      fullName: "",
      email: "",
      birthdate: "",
      phone: "",
      age: "",
    }
  );
  const [error, setError] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (event.target.name === "birthdate") {
      const birthdate = new Date(event.target.value);
      const today = new Date();
      const age = Math.floor(
        (today.getTime() - birthdate.getTime()) / 31536000000
      );

      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        age: age.toString(),
      });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit = () => {
    const valid = validateData();
    if (valid) {
      if (error === "") {
        if (Object.keys(editData).length !== 0 && editData?.index !== null) {
          setData((prev) => {
            const updatedData = [...prev];
            updatedData[editData?.index ?? 0] = formData;
            return updatedData;
          });
        } else {
          setData((prev) => [...prev, formData]);
        }

        closeModal();
      }
    }
  };

  const validateData = () => {
    if (formData.fullName === "") {
      setError("Full name is empty");
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email === "") {
      setError("Email is empty");
      return false;
    }
    if (!regex.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }

    if (formData.birthdate === "") {
      setError("Birthdate is empty");
      return false;
    }

    if (formData.phone === "") {
      setError("Phone is empty");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName ? formData.fullName : ""}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Full Name"
            />

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email ? formData.email : ""}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
            />
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate ? formData.birthdate : ""}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Birthdate"
            />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone ? formData.phone : ""}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Phone"
            />
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age ? formData.age : ""}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Age"
              disabled
            />
          </form>
          <p className="text-red-500 pt-4">{error}</p>
          <div className="flex justify-center mt-4 gap-x-2">
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={closeModal}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
