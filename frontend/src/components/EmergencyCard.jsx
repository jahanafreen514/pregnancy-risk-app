import { AlertTriangle } from "lucide-react";

function EmergencyCard({ user }) {

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex items-center gap-3 mb-5">

        <AlertTriangle
          className="text-red-600"
          size={35}
        />

        <h2 className="text-xl font-bold">
          Emergency Advice
        </h2>

      </div>

      {user.risk === "High" ? (

        <div className="space-y-3">

          <div className="bg-red-100 p-3 rounded-lg">
            🚑 Visit your doctor immediately.
          </div>

          <div className="bg-red-100 p-3 rounded-lg">
            ❤️ Monitor BP twice daily.
          </div>

          <div className="bg-red-100 p-3 rounded-lg">
            📞 Keep emergency contacts ready.
          </div>

          <div className="bg-red-100 p-3 rounded-lg">
            🏥 Avoid heavy physical work.
          </div>

        </div>

      ) : (

        <div className="space-y-3">

          <div className="bg-green-100 p-3 rounded-lg">
            ✅ Continue regular prenatal checkups.
          </div>

          <div className="bg-green-100 p-3 rounded-lg">
            ❤️ Stay healthy and hydrated.
          </div>

        </div>

      )}

    </div>

  );

}

export default EmergencyCard;
