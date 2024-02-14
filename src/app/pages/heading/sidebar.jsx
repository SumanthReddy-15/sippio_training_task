import { useState } from "react";
import { MenuItem } from "@fluentui/react-components";
import {
  Organization24Regular,
  ChevronDoubleLeft20Regular,
  ChevronDoubleRight20Regular,
  ChevronDown20Regular,
  ChevronUp20Regular,
  PersonAdd24Regular,
} from "@fluentui/react-icons";
import "../../../assets/sidebar-styles.scss";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { Link } from "react-router-dom";
import { FontIcon } from "@fluentui/react";
FontIcon;

initializeIcons();

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSubmenu, setActiveSubMenu] = useState(null);

  const handleSubmenuClick = (submenuId) => {
    setActiveSubMenu(activeSubmenu === submenuId ? null : submenuId);
  };

  const tabs = [
    {
      items: [
        {
          id: "specialBids",
          name: "Special Bids",
          icon: <PersonAdd24Regular />,
          route: "/specialBids",
        },
        {
          id: "privileges",
          name: "Privileges",
          icon: <Organization24Regular />,
          route: "/privileges",
        },
      ],
    },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sidebarClass = isExpanded
    ? "sidebar sidebar-expanded"
    : "sidebar sidebar-collapsed";
  //   const toggleButtonClass = isExpanded
  //     ? "toggle-button"
  //     : "toggle-button toggle-button-collapsed";

  const handleImage = () => {
    window.open("https://www.sippio.io/");
  };

  return (
    <>
      <div className="sidebar-main">
        <div className="sidebarMain">
          <div onClick={handleImage}>
            {isExpanded ? (
              <img
                src="https://sippio.io/wp-content/uploads/2022/02/sippio-logo.svg"
                alt="#"
                className="image"
              />
            ) : (
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADJklEQVR4AbWUA5BbURSG77y1bWN2atu2bdu2O6ht2253N6jdxpwGtW0j/V/dTHJfeGb+3fj7zrlnLnGkCs2XehZaIEsuvFAerREn+6ouJ6XLLyR5E3cWgHkAnIpcwOOP+G9CJkEgSy1KNkHiM/7LkNl4XMxlYEBKAJjLAi3kj4B5IHEOqeZEx1JfABYiXxETlwAl25FQe7uORUTmQLoANQYky9bOYzFyHQ3sgAB7JA+Vl5Ly0OHzxL6Ac3dOF6BJXIVEOG3T53NDuQU4JPaOHhbGWIIXoy/cn3zFZ7MLLZAPwuM8WmlWsEac2U8tStsLwEdbJDCFBpYEsrnghRbKT+C/1WXSSgsksiI2SCh2boxh/l28TBs6XwtJT8JR13SzGY04YzpGzXUUVf4KLJRP4ICjcwXgttWrV88YtSh1O4fA6n/Hf4Z+5vI8xM5Si/NFA/TaqsTlpJtpqV4MSe0+jwHkrTUByOUSB0slSl1Nm4LiYlIkASCWBVEEBjkqoLyU0oImgCmUIoAEInXMUg9pwAaXU7yjAoqLKeEANVCLkhpoJXmaaCV5zRNNoiq0D44s366NtUSUa5voqMCh/Zrw3MP6FhbS5FeiSXSF9vGAmACzGLw3wFGB7ENXWIiJkjKkYL2ungC9pwjsd1Qg55BuMU2Ad0QfS9gC6II1AeQzJFIdgIcC8pwicDcpMZ0hKPYYprMwSg6Hl2rG2CMAwHKO8W/88+GEqp0KsCCOzIwo05KxsftBHHB2/HXIv4UpHOOSwFHsxv9Y2tiRlVxwRLd108n/r/aEKp3K/YHRJd5Glmu3EY/bRZRvl8w7YvAHtAXCjvwlFzzn0I/u2xBLFVOxw1ozIDUQmASBLHMIPTqhQffI8lHmqd87EBeTxo0C9/nZevrNmly9Syp+/LYbBF5i9MWILZVSo1s6llLnQoH7ghwD4HZUngZ9QmMrddzqrAC65gt5RvrY6UfStRaWU+SAgI6fbWh1784bhjhbvBPnmNSa3crFVe64FDIGawLo9jaynp9jqHX54i2A3VSl2wwLTavVvRh2JVWYa/QX5BpKnTx2LZo4UN8BslHXhGGsUMYAAAAASUVORK5CYII="
                alt="Collapsed Logo"
              />
            )}
          </div>
          <div className={sidebarClass}>
            {tabs.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {" "}
                {isExpanded && <h3>{section.heading}</h3>}
                {section.items.map((tab) => (
                  <div key={tab.id}>
                    {" "}
                    <MenuItem
                      icon={tab.icon}
                      onClick={() =>
                        tab.submenu ? handleSubmenuClick(tab.id) : null
                      }
                    >
                      <div className="submenuIcon">
                        {isExpanded ? (
                          <>
                            {tab.route ? (
                              <Link to={tab.route} className="link">
                                {tab.name}
                              </Link>
                            ) : (
                              <span>{tab.name}</span>
                            )}
                            {tab.submenu &&
                              (activeSubmenu === tab.id ? (
                                <ChevronUp20Regular />
                              ) : (
                                <ChevronDown20Regular />
                              ))}
                          </>
                        ) : null}
                      </div>
                    </MenuItem>
                    {activeSubmenu === tab.id &&
                      tab.submenu &&
                      tab.submenu.map((submenuItem) => (
                        <MenuItem key={submenuItem.id} icon={submenuItem.icon}>
                          {" "}
                          {/* Key exists */}
                          {isExpanded ? (
                            <Link to={submenuItem.route} className="link">
                              {submenuItem.name}
                            </Link>
                          ) : null}
                        </MenuItem>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="expandIcon">
          {isExpanded ? (
            <ChevronDoubleLeft20Regular
              className="expand_Icon"
              onClick={toggleSidebar}
            />
          ) : (
            <ChevronDoubleRight20Regular
              className="expand_Icon"
              onClick={toggleSidebar}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
