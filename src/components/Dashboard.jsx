import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { Button } from "./ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "./ui/dropdown-menu";
import Puntuacion from './Puntuacion';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChartIcon } from 'lucide-react';
import Graficos from './Graficos';

export function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({ ratings: [], peliculas: [] });
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetch(`https://script.google.com/macros/s/AKfycbyGZPRQ0tqucsonA5a9MpFZi9-hblcSI6fvguMtrmBjfC5z3CU1IywBWblBwii4_mZg6Q/exec?id=${user.id}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error("Error fetching users:", error));
    }
  }, [user, navigate]);

  const activeView = location.pathname.includes('graficos') ? 'graficos' : 'puntuacion';

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="grid h-screen min-h-screen w-full bg-slate-950 text-white">
      <div className={`fixed z-20 left-0 top-0 w-[280px] h-full bg-slate-900 text-white transform transition-transform duration-300 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="border-t fixed w-full mt-[59px] pt-10 flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <button
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activeView === 'puntuacion' ? 'text-primary' : ''}`}
              onClick={() => navigate('/dashboard/puntuacion')}
            >
              <StarFilledIcon className="h-4 w-4" />
              Puntuacion
            </button>
            <button
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activeView === 'graficos' ? 'text-primary' : ''}`}
              onClick={() => navigate('/dashboard/graficos')}
            >
              <LineChartIcon className="h-4 w-4" />
              Analytics
            </button>
          </nav>
        </div>
      </div>
      <div className={`flex flex-col ${isSidebarVisible ? 'ml-[280px]' : 'ml-0'} transition-margin duration-300`}>
        <header className="flex fixed w-full left-0 h-[60px] items-center justify-between gap-4 border-b bg-slate-950 px-6 z-50">
          <Button size="icon" variant="borde" onClick={toggleSidebar} className=''>
            {isSidebarVisible ? <ArrowLeftIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800" size="icon" variant="borde">
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src="https://robohash.org/mail@ashallendesign.co.uk"
                  style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user && user['Full Name']}</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1  bg-slate-950 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {activeView === 'puntuacion' && <Puntuacion />}
          {activeView === 'graficos' && (
            <div className="grid">
                    {data && <Graficos  data={data} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 5l7 7-7 7" />
      <path d="M5 12h14" />
    </svg>
  );
}

