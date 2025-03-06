"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Agent {
  id: number;
  phone: string;
  email: string;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  photo: string;
  nationality: string;
}

interface SetupOrderProps {
  OrderId: string;
  onClose: () => void;
}

const Assign: React.FC<SetupOrderProps> = ({ OrderId, onClose }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [formData, setFormData] = useState({
    agentId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/agents");
        setAgents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch agents");
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentId) {
      setError("Please select an agent.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post("/api/agents/assign", {
        orderId: OrderId,
        agentId: formData.agentId,
      });
      setMessage("Order successfully assigned to agent.");
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed flex justify-center items-center bg-slate-100 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-2 py-1 border top-7 text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"
      ></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Assign Delivery To Agent
        </h4>
        <form className="my-2" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col w-full mr-1">
              <label className="text-sm font-semibold" htmlFor="orderId">
                Order number
              </label>
              <input
                type="text"
                name="orderId"
                value={OrderId}
                disabled
                className="px-5 py-3 outline-none border-slate-300 text-sm border my-1"
              />
            </div>
            <div className="flex flex-col w-full ml-1">
              <label className="text-sm font-semibold" htmlFor="agentId">
                Agent
              </label>
              <select
                name="agentId"
                className="px-5 py-3 outline-none border-slate-300 text-sm border my-1 font-semibold text-slate-500"
                value={formData.agentId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select agent --</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {`${agent.first_name} ${agent.last_name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {message || error ? (<p className={`${error ? 'bg-red-100 text-red-500 ':'bg-green-100 text-green-500 '}text-sm mt-2 px-3 py-2 rounded-xl`}>{message || error}</p>) : ""}
          <div className="flex flex-col w-full mt-4">
            <button
              type="submit"
              className={`flex items-center justify-center font-bold text-sm py-3 rounded-3xl border w-full my-2 text-white ${
                isSubmitting ? "bg-slate-300 cursor-no-drop" : "bg-orange-400"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Assigning..." : "Assign"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Assign;
