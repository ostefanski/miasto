import { useRef, useState, useEffect } from "react";
import "./App.css";
import DropDownButton from "src/Components/Dropdown/DropDownButton";
import Map from "src/Components/Map/Map";
import AutoCompleteSearchBar from "src/Components/AutoComplete/AutoCompleteSearchBar";
import SearchNearbyButton from "src/Components/SearchNearby/SearchNearbyButton";
import ShowPlaceDetails from "src/Components/ShowDetails/ShowPlaceDetails";
import DropDownCategoriesSearch from "src/Components/Categories/DropDownCategoriesSearch";
import TransportationButton from "src/Components/TransportMode/TransportButton";
import Help from "src/Components/HelpCenter/Help";
import AreaButton from "src/Components/AreaMode/AreaButton";
import Menu from "src/Components/MenuList/Menu";
import Logo from "src/assets/LogoMiasto15_v2.svg";

function App() {
  const [chosenCity, setChosenCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<
    google.maps.LatLng | undefined
  >(undefined);
  const [count, setCount] = useState(0);
  const [categoriesTypes, setCategoriesTypes] = useState([]);
  const [initCategoriesForMenuList, setInitCategoriesForMenulist] = useState(
    []
  );
  const [showPlaceInfo, setShowPlaceInfo] = useState({
    name: "",
    formattedAddress: "",
    duration: "",
    distance: "",
  });
  // @@ "walk" mógłby być wartościością enuma
  const [activeTransportButton, setActiveTransportButton] = useState("walk");
  // @@ 15 to magic number, mógłby być zapisany w jakiejś zmiennej
  const [activeAreaButton, setActiveAreaButton] = useState("15");

  // @@ można by stworzyć interfejs dla użytego tutaj typu
  const [menuGrabberCategoriesList, setMenuGrabberCategoriesList] = useState(
    {}
  );

  // @@ użyty tu interfejs można by wydzielić reużywać w różnych miejscach
  const [directionsMenu, setDirectionsMenu] = useState<
    Record<
      string,
      {
        direction: google.maps.DirectionsResult;
        name: string;
        distance: string;
        duration: string;
        formattedAddress: string;
      }[]
    >
  >({});
  const directionsRenderinstance =
    useRef<google.maps.DirectionsRenderer | null>(null);


  // @@ tę całą sekcję z windowWidth aż do const isMobile można by było wynieść z tego komponentu i zapakować do własnego hooka,
  // który będzie tu użyty, dzięki czemu zmniejszy się poziom skomplikowania funkcji. Hook mógłby po prostu zwracać booleana isMobile
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 1030;

  if (isMobile) {
    return (
      <div className="app">
        <div className="side-bar">
          <div className="logo">
            <img src={Logo} alt="Logo" className="logo-sailor" />
          </div>
          <AutoCompleteSearchBar
              // @@ polecam spróbować dodać react-intl, dzięki czemu apka będzie mogła być wielojęzyczna
            placeholder="Podaj dokładny adres ..."
            setSelectedLocation={setSelectedLocation}
          />
          <SearchNearbyButton setCount={setCount} />
          <Menu
            setShowPlaceInfo={setShowPlaceInfo}
            initCategoriesForMenuList={initCategoriesForMenuList}
            menuGrabberCategoriesList={menuGrabberCategoriesList}
            directionsRenderinstance={directionsRenderinstance}
            directionsMenu={directionsMenu}
          />
        </div>
        <div className="main-container">
          <div className="dropdowns">
            <div className="dropdown">
              <DropDownButton
                chosenCity={chosenCity}
                setChosenCity={setChosenCity}
              />
            </div>
            <div className="dropdown">
              <DropDownCategoriesSearch
                setCategoriesTypes={setCategoriesTypes}
              />
            </div>
          </div>
          <div className="map-container">
            <Map
              chosenCity={chosenCity}
              selectedLocation={selectedLocation}
              count={count}
              setShowPlaceInfo={setShowPlaceInfo}
              categoriesTypes={categoriesTypes}
              setInitCategoriesForMenulist={setInitCategoriesForMenulist}
              activeTransportButton={activeTransportButton}
              activeAreaButton={activeAreaButton}
              setMenuGrabberCategoriesList={setMenuGrabberCategoriesList}
              directionsRenderinstance={directionsRenderinstance}
              setDirectionsMenu={setDirectionsMenu}
            />
            <div className="over_map_transport">
              <TransportationButton
                setActiveTransportButton={setActiveTransportButton}
              />
            </div>
            <div className="over_map_area">
              <AreaButton setActiveAreaButton={setActiveAreaButton} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="app">
        <div className="side-bar">
          <h1>15-Minute City</h1>
          <AutoCompleteSearchBar
            placeholder="Podaj dokładny adres"
            setSelectedLocation={setSelectedLocation}
          />
          <SearchNearbyButton setCount={setCount} />
          <ShowPlaceDetails showPlaceInfo={showPlaceInfo} />
        </div>
        <div className="main-container">
          <Help />
          <div className="dropdowns">
            <div className="dropdown">
              <DropDownButton
                chosenCity={chosenCity}
                setChosenCity={setChosenCity}
              />
            </div>
            <div className="dropdown">
              <DropDownCategoriesSearch
                setCategoriesTypes={setCategoriesTypes}
              />
            </div>
            <div className="menu">
              <Menu
                setShowPlaceInfo={setShowPlaceInfo}
                initCategoriesForMenuList={initCategoriesForMenuList}
                menuGrabberCategoriesList={menuGrabberCategoriesList}
                directionsRenderinstance={directionsRenderinstance}
                directionsMenu={directionsMenu}
              />
            </div>
          </div>
          <div className="map-container">
            <Map
              chosenCity={chosenCity}
              selectedLocation={selectedLocation}
              count={count}
              setShowPlaceInfo={setShowPlaceInfo}
              categoriesTypes={categoriesTypes}
              setInitCategoriesForMenulist={setInitCategoriesForMenulist}
              activeTransportButton={activeTransportButton}
              activeAreaButton={activeAreaButton}
              setMenuGrabberCategoriesList={setMenuGrabberCategoriesList}
              directionsRenderinstance={directionsRenderinstance}
              setDirectionsMenu={setDirectionsMenu}
            />
            <div className="over_map_transport">
              <TransportationButton
                setActiveTransportButton={setActiveTransportButton}
              />
            </div>
            <div className="over_map_area">
              <AreaButton setActiveAreaButton={setActiveAreaButton} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// @@ w "nowym" front-endzie przeważają imienne exporty nad export default.
// czyli: export function App... itd.
// nawet jeśli jest tylko jeden export w pliku
// IDE sobie lepiej z tym radzi. export default ma sens głównie wtedy, gdy chcemy robić lazy loading poszczególnych fragmentów aplikacji.
export default App;
