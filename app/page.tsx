import Header, {SalesDash} from "@/app/comps/dashboard/indexPage";
import ChatAnalytics from "./comps/dashboard/charts";


const sampleData = [
  { day: "Mon", previous: 10, current: 15 },
  { day: "Tue", previous: 8, current: 12 },
  { day: "Wed", previous: 12, current: 18 },
  { day: "Thu", previous: 14, current: 20 },
  { day: "Fri", previous: 16, current: 22 },
  { day: "Sat", previous: 9, current: 14 },
  { day: "Sun", previous: 11, current: 17 },
];
const Dashoard = () =>{
    return (
        <>
        <head>
            <title>Dashboard | Bia Admin</title>
        </head>
        <div className="flex justify-end items-center">
            <Header />
        </div>
        <div className="flex flex-wrap w-full py-3 justify-around">
            <SalesDash />
        </div>
        <div className="">
            <ChatAnalytics data={sampleData} />
        </div>
        </>
    );
}
export default Dashoard;
