import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import RadioCard from "@/shared/components/ui/radio-card";
import { Label } from "@/shared/components/ui/label";
import { FiUser, FiPhone, FiMail, FiDollarSign, FiPercent } from "react-icons/fi";

const InputDemo = () => {
  const [values, setValues] = useState({
    text: "",
    email: "",
    phone: "",
    amount: "",
    percentage: "",
    select: "",
    radioCard: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Input System Playground</h1>
        <p className="text-sm text-gray-500 mt-2">
          Semua variant <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Input</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Select</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Radio Group</code>, dan <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">RadioCard</code> — with prefix, suffix, and various use cases.
        </p>
      </div>

      {/* DESIGN RULES */}
      <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 space-y-2">
        <h2 className="text-xl font-semibold">Design System Rules</h2>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <li>• Semua input, select, radio rounded-xl, consistent padding and height</li>
          <li>• <code>prefix</code> dan <code>suffix</code> props untuk elemen tambahan</li>
          <li>• Focus state dengan ring effect berwarna primary</li>
          <li>• Support dark mode seamlessly</li>
          <li>• Disabled state dengan background abu-abu dan opacity</li>
        </ul>
      </div>

      {/* BASIC INPUTS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Text Input</Label>
            <Input
              name="text"
              placeholder="Masukkan teks..."
              value={values.text}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Email Input</Label>
            <Input
              type="email"
              name="email"
              placeholder="email@contoh.com"
              value={values.email}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* PREFIX INPUTS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Inputs with Prefix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Phone Number</Label>
            <Input
              name="phone"
              placeholder="812-3456-7890"
              value={values.phone}
              onChange={handleChange}
              prefix="+62"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Currency</Label>
            <Input
              type="number"
              name="amount"
              placeholder="100000"
              value={values.amount}
              onChange={handleChange}
              prefix="Rp"
            />
          </div>
        </div>
      </div>

      {/* SUFFIX INPUTS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Inputs with Suffix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Percentage</Label>
            <Input
              type="number"
              name="percentage"
              placeholder="75"
              value={values.percentage}
              onChange={handleChange}
              suffix="%"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Weight (kg)</Label>
            <Input
              type="number"
              placeholder="50"
              suffix="kg"
            />
          </div>
        </div>
      </div>

      {/* SELECT INPUTS (RADIX) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Select Inputs (Radix)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Pilih Opsi</Label>
            <Select
              value={values.select}
              onValueChange={(val) => setValues({ ...values, select: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih opsi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Opsi 1</SelectItem>
                <SelectItem value="2">Opsi 2</SelectItem>
                <SelectItem value="3">Opsi 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Disabled Select</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Pilih opsi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Opsi 1</SelectItem>
                <SelectItem value="2">Opsi 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>



      {/* RADIO CARD (FROM PLANNING FORM) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Radio Card (From Planning Form)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadioCard
            label="Planting Mangrove"
            checked={values.radioCard === "planting"}
            onChange={() => setValues({ ...values, radioCard: "planting" })}
          />
          <RadioCard
            label="Coral Transplanting"
            checked={values.radioCard === "coral"}
            disabled
            onChange={() => setValues({ ...values, radioCard: "coral" })}
          />
        </div>
      </div>

      {/* DISABLED INPUTS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Disabled Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Disabled Text</Label>
            <Input
              placeholder="Tidak bisa diubah"
              disabled
              value="Nilai tetap"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Disabled with Prefix & Suffix</Label>
            <Input
              type="number"
              placeholder="6"
              disabled
              value="6"
              prefix="Durasi"
              suffix="bulan"
            />
          </div>
        </div>
      </div>

      {/* FORM SCENARIO */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Scenario</h2>
        <div className="p-6 rounded-xl border space-y-6 max-w-md">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nama Lengkap</Label>
            <Input placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Email</Label>
            <Input type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nomor Telepon</Label>
            <Input placeholder="812-3456-7890" prefix="+62" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tinggi (cm)</Label>
              <Input type="number" placeholder="170" suffix="cm" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Berat (kg)</Label>
              <Input type="number" placeholder="70" suffix="kg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputDemo;
