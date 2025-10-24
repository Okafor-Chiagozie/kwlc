# KWLC WebAPI Endpoint Categories (Tags)

Source: `http://musharealestate-001-site4.jtempurl.com/swagger/v1/swagger.json`

- Book
- BookPurchase
- Branch
- BranchReport
- ChurchProject
- CountryStateLGA
- Dashboard
- Donation
- Event
- HomePage
- Livestream
- Minister
- Payment
- Ticket
- User
- Wedding

## Book Endpoints

- POST `/api/v1/Book/AddBook` - only admin
- PUT `/api/v1/Book/UpdateBook` - only admin
- GET `/api/v1/Book/GetBook`
- GET `/api/v1/Book/GetBookSummary`
- POST `/api/v1/Book/GetBooks`
- DELETE `/api/v1/Book/DeleteBook` - only admin

## BookPurchase Endpoints

- POST `/api/v1/BookPurchase/InitiateOrder`
- POST `/api/v1/BookPurchase/GetBookPurchases` - only admin
- GET `/api/v1/BookPurchase/BookPurchaseSummary` - only admin
- GET `/api/v1/BookPurchase/GetBookPurchase` - only admin
- DELETE `/api/v1/BookPurchase/DeletebookPurchase` - only admin
- POST `/api/v1/BookPurchase/GetBookPurchasesReport` - only admin
- POST `/api/v1/BookPurchase/DownloadBookPurchasesReport` - only admin

## Branch Endpoints

- POST `/api/v1/Branch/CreateOrUpdateBranch` - only admin
- POST `/api/v1/Branch/GetAllBranches`
- GET `/api/v1/Branch/GetBranchDetails`
- GET `/api/v1/Branch/GetBranchesLocations`
- DELETE `/api/v1/Branch/DeleteBranch` - only admin
- POST `/api/v1/Branch/CreateBranchImages` - only admin
- PUT `/api/v1/Branch/UpdateBranchImages` - only admin
- GET `/api/v1/Branch/GetBranchImages`
- GET `/api/v1/Branch/GetBranchImage`
- DELETE `/api/v1/Branch/DeleteBranchImage` - only admin
- POST `/api/v1/Branch/CreateOrUpdateWeeklyActivity` - only admin
- GET `/api/v1/Branch/GetWeeklyActivity`
- GET `/api/v1/Branch/GetWeeklyActivities`
- GET `/api/v1/Branch/GetAllWeeklyActivities`
- DELETE `/api/v1/Branch/DeleteWeeklyActivity` - only admin

## BranchReport Endpoints

- POST `/api/v1/BranchReport/CreateBranchReport` - only admin
- POST `/api/v1/BranchReport/GetBranchReports` - only admin
- GET `/api/v1/BranchReport/GetBranchReport` - only admin
- POST `/api/v1/BranchReport/GetOnlinePaymentReports` - only admin
- POST `/api/v1/BranchReport/DownloadBranchReport` - only admin
- POST `/api/v1/BranchReport/DownloadOnlinePaymentReport` - only admin

## ChurchProject Endpoints

- POST `/api/v1/ChurchProject/CreateOrUpdateProject` - only admin
- POST `/api/v1/ChurchProject/GetProjects`
- POST `/api/v1/ChurchProject/SearchProjects`
- GET `/api/v1/ChurchProject/GetProject`
- DELETE `/api/v1/ChurchProject/DeleteProject` - only admin
- POST `/api/v1/ChurchProject/CreateProjectImages` - only admin
- PUT `/api/v1/ChurchProject/UpdateProjectImages` - only admin
- GET `/api/v1/ChurchProject/GetProjectImages`
- GET `/api/v1/ChurchProject/GetProjectImage`
- DELETE `/api/v1/ChurchProject/DeleteProjectImage` - only admin

## CountryStateLGA Endpoints

- GET `/api/v1/CountryStateLGA/countries`
- GET `/api/v1/CountryStateLGA/{countryId}/states`
- GET `/api/v1/CountryStateLGA/{countryId}/{stateId}/lgas`

## Dashboard Endpoints

- GET `/api/v1/Dashboard/BranchDashBord` - only admin
- GET `/api/v1/Dashboard/FinancialReportDashBoard` - only admin
- GET `/api/v1/Dashboard/EventReportDashBoard` - only admin
- GET `/api/v1/Dashboard/MinisterReportDashBoard` - only admin
- GET `/api/v1/Dashboard/BookReportDashBoard` - only admin
- GET `/api/v1/Dashboard/StreamReportDashBoard` - only admin

## Donation Endpoints

- POST `/api/v1/Donation/InitiateDonation`
- POST `/api/v1/Donation/GetChurchProjectDonations` - only admin
- POST `/api/v1/Donation/GetCommunityDonations` - only admin
- POST `/api/v1/Donation/DownloadDonationReport` - only admin
- GET `/api/v1/Donation/GetDonation` - only admin
- DELETE `/api/v1/Donation/DeleteDonation` - only admin

## Event Endpoints

- POST `/api/v1/Event/SearchEvent`
- POST `/api/v1/Event/CreateOrUpdateEvent` - only admin
- GET `/api/v1/Event/GetEventDetail`
- GET `/api/v1/Event/GetEvent`
- GET `/api/v1/Event/GetBranchEventsDetails`
- GET `/api/v1/Event/UpcomingEvents`
- GET `/api/v1/Event/FeaturedEvent`
- POST `/api/v1/Event/updateattendees` - only admin
- DELETE `/api/v1/Event/DeleteEvent` - only admin
- POST `/api/v1/Event/CreateOrUpdateEventSpeaker` - only admin
- GET `/api/v1/Event/GetEventSpeaker`
- GET `/api/v1/Event/GetEventSpeakers`
- DELETE `/api/v1/Event/DeleteEventSpeaker` - only admin
- POST `/api/v1/Event/CreateEventImage` - only admin
- PUT `/api/v1/Event/UpdateEventImage` - only admin
- GET `/api/v1/Event/GetEventImages`
- GET `/api/v1/Event/GetEventImage`
- DELETE `/api/v1/Event/DeleteEventImage` - only admin
- POST `/api/v1/Event/CreateOrUpdateEventSchedule` - only admin
- GET `/api/v1/Event/GetEventSchedules`
- GET `/api/v1/Event/GetEventSchedule`
- DELETE `/api/v1/Event/DeleteEventSchedule` - only admin
- GET `/api/v1/Event/GetEventTypes`
- GET `/api/v1/Event/GetBranchEvents`
- POST `/api/v1/Event/GetEventsReport` - only admin
- POST `/api/v1/Event/DownloadEventsReport` - only admin

## HomePage Endpoints

- GET `/api/v1/HomePage/GetHomePage`
- POST `/api/v1/HomePage/CreateOrUpdateChurchDetails` - only admin
- POST `/api/v1/HomePage/CreateOrUpdateServiceScheduleDetails` - only admin
- GET `/api/v1/HomePage/GetAllServiceSchedules`
- GET `/api/v1/HomePage/GetServiceSchedule`
- DELETE `/api/v1/HomePage/DeleteServiceSchedule` - only admin
- POST `/api/v1/HomePage/CreateOrUpdateChurchdayDetails` - only admin
- GET `/api/v1/HomePage/GetAllChurchdays`
- DELETE `/api/v1/HomePage/DeleteChurchDay` - only admin
- POST `/api/v1/HomePage/CreateChurchImage` - only admin
- PUT `/api/v1/HomePage/UpdateChurchImage` - only admin
- GET `/api/v1/HomePage/GetChurchImages`
- POST `/api/v1/HomePage/ContactUs`
- GET `/api/v1/HomePage/GetChurchImage`
- DELETE `/api/v1/HomePage/DeleteChurchImage` - only admin

## Livestream Endpoints

- GET `/api/v1/Livestream/GetLivestreamUrl`
- POST `/api/v1/Livestream/GetCompletedStreams`
- POST `/api/v1/Livestream/GetUpcomingStreams`
- POST `/api/v1/Livestream/GetNormalUploadsAsync`
- POST `/api/v1/Livestream/GetShortVideosAsync`
- POST `/api/v1/Livestream/GetAllAvailableStreams`
- GET `/api/v1/Livestream/GetStreamDetailsByURL`
- GET `/api/v1/Livestream/GetStreamDetailsById`
- DELETE `/api/v1/Livestream/DeleteStream` - only admin

## Minister Endpoints

- POST `/api/v1/Minister/CreateOrUpdateMinster` - only admin
- POST `/api/v1/Minister/GetMinsiters` - only admin
- GET `/api/v1/Minister/GetAllMinisters`
- GET `/api/v1/Minister/GetMinister`
- GET `/api/v1/Minister/GetBranchMinsiters`
- DELETE `/api/v1/Minister/DeleteMinister` - only admin

## Payment Endpoints

- POST `/api/v1/Payment/InitiatePayment`
- POST `/api/v1/Payment/VerifyPayment`
- GET `/api/v1/Payment/ProcessPaymentWebHook`
- POST `/api/v1/Payment/InitiateOnlinePayment`

## Ticket Endpoints

- POST `/api/v1/Ticket/CreateOrUpdateTicket` - only admin
- GET `/api/v1/Ticket/GetTicket`
- GET `/api/v1/Ticket/GetTicketById`
- DELETE `/api/v1/Ticket/DeleteTicket` - only admin

## User Endpoints

- POST `/api/v1/User/login`
- POST `/api/v1/User/registration`
- PUT `/api/v1/User/updateUser`
- POST `/api/v1/User/GetAllUsers` - only admin
- GET `/api/v1/User/{id}` - only admin
- POST `/api/v1/User/blockUser` - only admin
- POST `/api/v1/User/unblock` - only admin
- POST `/api/v1/User/ForgotPassword`
- POST `/api/v1/User/ResetPassword`
- POST `/api/v1/User/ChangePassword`
- GET `/api/v1/User/Roles` - only admin

## Wedding Endpoints

- POST `/api/v1/Wedding/CreateOrUpdateWedding` - only admin
- GET `/api/v1/Wedding/GetAllWeddings`
- GET `/api/v1/Wedding/GetUpcomingWeddings`
- GET `/api/v1/Wedding/GetBranchWeddings`
- GET `/api/v1/Wedding/GetWedding`
- DELETE `/api/v1/Wedding/DeleteWedding` - only admin
- POST `/api/v1/Wedding/CreateWeddingImage` - only admin
- PUT `/api/v1/Wedding/UpdateWeddingImage` - only admin
- GET `/api/v1/Wedding/GetWeddingImages`
- GET `/api/v1/Wedding/GetWeddingImage`
- DELETE `/api/v1/Wedding/DeleteWeddingImage` - only admin
