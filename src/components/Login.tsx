import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "./ui/card";
import { InputLogin } from "./ui/inputLogin";
import { Button } from "./ui/button";
import { MdLocalMovies } from "react-icons/md";
import { UserContext, User } from "../context/userContext";

export function Login() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbyzFbdkHoPBORZcFBX1Ob-cp0W6qHa3hUWBXrBg35sceGmpjUZlRjMwt44tj3z_D4Dtgw/exec")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const foundUser = users.find(user => user.id === username && user['Full Name'] === password);
    if (foundUser) {
      setUser(foundUser);
      setMessage(`Login Exitoso: ${JSON.stringify(foundUser)}`);
      navigate('/dashboard');
    } else {
      setMessage("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Card className="mx-auto w-[30rem] border-none bg-black max-w-md font-body text-white">
      <CardHeader className="">
        <div className="flex items-center justify-center mb-9">
          <MdLocalMovies className="text-[#0385ff] text-[3.5rem] mr-4" />
          <CardTitle className="text-5xl tracking-normal text-center">Movie Page</CardTitle>
        </div>
        <CardDescription className="text-center dark:text-white text-md"> Ingresa a tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        <form onSubmit={handleSubmit} className="space-y-16">
          <div className="space-y-20">
            <InputLogin
              id="username"
              placeholder="Ingresa tu usuario"
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-20">
            <InputLogin
              id="password"
              placeholder="Ingresa tu contraseña"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full bg-[#0385ff] dark:text-white text-lg py-8 rounded-none hover:bg-blue-600/70" type="submit">
            Acceder
          </Button>
        </form>
        <div className="h-6 flex items-center justify-center">
          {message && <p className="text-center text-sm text-red-500">{message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
