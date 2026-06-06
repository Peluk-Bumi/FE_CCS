import { DesktopNavButton } from "@/shared/components/ui/navigation/DesktopNavButton";

export default function DesktopNavigation({ navItems, currentPath, onNavigate }) {
  return (
    <>
      {/* Icon-only mode for md screens */}
      <div className="flex lg:hidden items-center space-x-2">
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
      </div>

      {/* Full text mode for lg screens */}
      <div className="hidden lg:flex items-center space-x-2">
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
      </div>
    </>
  );
}
