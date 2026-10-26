import SearchBar from "../components/search/SearchBar";
import RealEstateImg from "../assets/property.jpg";

const Home = () => {
  return (
    <div className="h-screen w-full">
      <div
        className="h-[75vh] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${RealEstateImg})` }}
      >
        <div className="flex justify-center items-center h-screen md:px-0 px-5 md:mx-0 mx-2">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
