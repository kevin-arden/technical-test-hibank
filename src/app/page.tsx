"use client";
import { useRouter, redirect } from "next/navigation";
import { useRef, useState } from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import { FormData, Modal, SelectedData } from "./components/Modal";
import * as XLSX from "xlsx";
import Link from "next/link";
import SideMenu from "./components/SideMenu";

export default function Home() {
  let token = localStorage ? localStorage.getItem("userData") : null;
  let auth = token ? JSON.parse(token) : null;

  const [data, setData] = useState<FormData[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<SelectedData>({
    index: null,
    data: {
      fullName: "",
      email: "",
      birthdate: "",
      phone: "",
      age: "",
    },
  });

  const handleDelete = (index: number) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1); // Remove the item from the array
      return updatedData;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", cellDates: true });
      const parsedData: FormData[] = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      // Update table data
      const transformedData: FormData[] = parsedData.map((obj: any) => ({
        fullName: obj["Full Name"],
        email: obj["Email"],
        birthdate: new Date(obj["Birth Date"]).toISOString().split("T")[0],
        phone: obj["Phone"],
        age: obj["Age"],
      }));

      setData((prev) => [...prev, ...transformedData]);
    };
    if (file) {
      reader.readAsBinaryString(file); // Read as binary for XLSX
    }
  };

  const handleDownload = () => {
    const tableHeaders = [
      "Full Name",
      "Email",
      "Birth Date",
      "Phone",
      "Age",
    ].join(",");

    const formattedData = data
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");

    const completeData = `${tableHeaders}\n${formattedData}`;

    const blob = new Blob([completeData], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();

    try {
      link.click();
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };

  return (
    <>
      {auth ? (
        <>
          <Header />
          <div className="flex">
            <SideMenu />
            <div className=" w-[80%] h-svh p-8">
              <div className="justify-between flex mb-4">
                <div className="flex gap-x-2">
                  <Button
                    onClick={() => {
                      setShowModal(true);
                      setSelected({} as SelectedData);
                    }}
                  >
                    New
                  </Button>
                  <input
                    type="file"
                    id="file-input"
                    name="file-input"
                    hidden
                    onChange={handleFileChange}
                    onClick={(event) => {
                      (event.target as HTMLInputElement).value = "";
                    }}
                  />

                  <label
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                    id="file-input-label"
                    htmlFor="file-input"
                  >
                    Input
                  </label>
                </div>
                <Button onClick={() => handleDownload()}>Download</Button>
              </div>
              <div className="border">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-start border">Full Name</th>
                      <th className="px-4 py-2 text-start border">Email</th>
                      <th className="px-4 py-2 text-start border">Birthdate</th>
                      <th className="px-4 py-2 text-start border">Phone</th>
                      <th className="px-4 py-2 text-start border">Age</th>
                      <th className="px-4 py-2 text-start border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2 border">{item.fullName}</td>
                          <td className="px-4 py-2 border">{item.email}</td>
                          <td className="px-4 py-2 border">{item.birthdate}</td>
                          <td className="px-4 py-2 border">{item.phone}</td>
                          <td className="px-4 py-2 border">{item.age}</td>
                          <td className="flex p-2 gap-x-2 border">
                            <Button
                              onClick={() => {
                                setSelected({ index: index, data: item });
                                setShowModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button onClick={() => handleDelete(index)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {showModal && (
            <Modal
              closeModal={() => {
                setShowModal(false);
                setSelected({} as SelectedData);
              }}
              editData={selected}
              setData={setData}
            />
          )}
        </>
      ) : (
        redirect("/login")
      )}
    </>
  );
}
