import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./style/TelaCadastroInfoBasica.css";

const TelaCadastroInfoBasica = ({ userType, onContinue, onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-basic-info-screen">
      <div className="signup-header">
        <button onClick={onBack} className="signup-back-button">
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }}>
          {/* Content here */}
        </motion.div>
      </div>
    </div>
  );
};

export default TelaCadastroInfoBasica;