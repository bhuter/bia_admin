import { motion } from 'framer-motion';
import { useState } from 'react';
import AlertNotification from '../toggles/notify';

type PasswordChangeProps = {
  onClose: () => void;
};

export const PasswordChangeModal = ({ onClose }: PasswordChangeProps) => {
  const [prevPass, setPrevPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
      if (userSession && userSession.id) {
        const userId = userSession.id;
        const response = await fetch('/api/auth/update/change_password', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ prevPassword: prevPass, password: newPass, id: userId }),
        });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccess('Password updated successfully! Redirecting...');
      setTimeout(() => {
        window.location.assign('/');
      }, 1500);
     }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-green-600">
          🔒 Change Password
        </h2>

        {error && <AlertNotification message={error} type="error" />}
        {success && <AlertNotification message={success} type="success" />}

        <input
          type="password"
          value={prevPass}
          onChange={(e) => setPrevPass(e.target.value)}
          placeholder="Previous password"
          className="border rounded-lg px-3 py-2 mb-2 w-full focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          placeholder="New password"
          className="border rounded-lg px-3 py-2 mb-2 w-full focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="Confirm new password"
          className="border rounded-lg px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleChangePassword}
          className={`${
            loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          } text-white py-2 px-4 rounded-lg w-full transition`}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </motion.div>
    </motion.div>
  );
};
