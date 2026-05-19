import { FiCheckCircle } from "react-icons/fi";
import { DesktopNavButton } from "@/shared/components/ui/navigation/DesktopNavButton";

export default function DesktopNavigation({ navItems, currentPath, onNavigate, onVerifikasiNav }) {
  return (
    <>
      {/* Icon-only mode for md screens */}
      <div className="hidden md:flex lg:hidden items-center space-x-2 absolute left-[60%] transform -translate-x-1/2">
        {navItems.map((item) => (
          <DesktopNavButton
            key={item.name}
            active={currentPath === item.path}
            icon={<item.icon className="w-4 h-4" />}
            onClick={() => onNavigate(item.path)}
            iconOnly
            title={item.name}
          />
        ))}

        {/* Verifikasi — icon only */}
        <DesktopNavButton
          icon={<FiCheckCircle className="w-4 h-4" />}
          onClick={onVerifikasiNav}
          iconOnly
          title="Verifikasi"
        />
      </div>

      {/* Full text mode for lg screens */}
      <div className="hidden lg:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => (
          <DesktopNavButton
            key={item.name}
            active={currentPath === item.path}
            icon={<item.icon className="w-4 h-4" />}
            onClick={() => onNavigate(item.path)}
          >
            {item.name}
          </DesktopNavButton>
        ))}

        {/* Verifikasi — dengan icon */}
        <DesktopNavButton
          icon={<FiCheckCircle className="w-4 h-4" />}
          onClick={onVerifikasiNav}
        >
          Verifikasi
        </DesktopNavButton>
      </div>
    </>
  );
}
