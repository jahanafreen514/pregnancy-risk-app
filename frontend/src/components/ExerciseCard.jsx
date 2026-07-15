import { Dumbbell } from "lucide-react";

function ExerciseCard({ user }) {

  let exercises = [];

  if (user.risk === "High") {

    exercises = [
      "Doctor Approved Walking",
      "Deep Breathing",
      "Light Stretching",
    ];

  }

  else if (user.trimester === "3rd") {

    exercises = [
      "Walking",
      "Pelvic Exercises",
      "Breathing Exercise",
    ];

  }

  else {

    exercises = [
      "20 min Walk",
      "Prenatal Yoga",
      "Stretching",
    ];

  }

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex items-center gap-3 mb-5">

        <Dumbbell
          className="text-green-600"
          size={35}
        />

        <h2 className="text-xl font-bold">
          Exercise
        </h2>

      </div>

      <ul className="space-y-3">

        {exercises.map((item, index) => (

          <li
            key={index}
            className="bg-green-50 rounded-lg p-3"
          >

            🏃 {item}

          </li>

        ))}

      </ul>

    </div>

  );

}

export default ExerciseCard;
