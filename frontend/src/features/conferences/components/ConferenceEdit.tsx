// import type { SaveConferenceDto } from "types";

// export const convertConferenceToEditObject = (conference: SaveConferenceDto): SaveConferenceDto => ({
//   id: conference.id,
//   name: conference.name || "",
//   organizerEmail: conference.organizerEmail || "",
//   startDate: conference.startDate ? conference.startDate.split('T')[0] : "",
//   endDate: conference.endDate ? conference.endDate.split('T')[0] : "",
//   conferenceTypeId: conference.conferenceTypeId || 0,
//   categoryId: conference.categoryId || 0,
//   locationId: conference.locationId || 0,
//   location: {
//     locationId: conference.location?.locationId || 0,
//     name: conference.location?.name || "",
//     code: conference.location?.code || "",
//     address: conference.location?.address || "",
//     longitude: conference.location?.longitude || 0,
//     latitude: conference.location?.latitude || 0,
//     countryId: conference.location?.countryId || 0,
//     countyId: conference.location?.countyId || 0,
//     cityId: conference.location?.cityId || 0
//   },
//   speakerList: conference.speakerList?.map(speaker => ({
//     speakerId: speaker.id || 0,
//     name: speaker.name || "",
//     nationality: speaker.nationality || "",
//     rating: speaker.rating || 0,
//     isMainSpeaker: speaker.isMainSpeaker || false
//   })) || [{
//     speakerId: 0,
//     name: "",
//     nationality: "",
//     rating: 0,
//     isMainSpeaker: false
//   }]
// });

// const ConferenceEdit: React.FC = () => {
//   return <div>Conference Edit Component</div>;
// };

// export default ConferenceEdit;
