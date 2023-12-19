import "./ShowPlaceDetails.css";

type ShowPlaceDetailsProps = {
  showPlaceInfo: {
    name: string;
    formattedAddress: string;
    duration: string;
    distance: string;
  };
};

const ShowPlaceDetails: React.FC<ShowPlaceDetailsProps> = ({
  showPlaceInfo,
}) => {
  return (
    <div className="info">
      <h2>Place Details</h2>
      <p>
        <b>Name:</b> {showPlaceInfo.name}
      </p>
      <p>
        <b>Address:</b> {showPlaceInfo.formattedAddress}
      </p>
      <p>
        <b>Travel time:</b> {showPlaceInfo.duration}
      </p>
      <p>
        <b>Distance:</b> {showPlaceInfo.distance}
      </p>
    </div>
  );
};

export default ShowPlaceDetails;
