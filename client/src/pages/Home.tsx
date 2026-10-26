import SearchBar from "../components/search/SearchBar";

const Home = () => {
  return (
    <div className="h-screen w-full">
      <div
        className="h-[75vh] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://res.cloudinary.com/dtu2furcy/image/upload/v1793056902/property_vidimr.jpg)' }}
      >
        <div className="flex justify-center items-center h-screen md:px-0 px-5 md:mx-0 mx-2">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
