const API_BASE_URL =
  'http://127.0.0.1:8000';


// ============================================================
// RUN SIMULATION
// ============================================================

export async function runSimulation(
  simulationConfig
) {

  const response =
    await fetch(
      `${API_BASE_URL}/simulation/run`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Accept:
            'application/json'
        },

        body:
          JSON.stringify(
            simulationConfig
          )
      }
    );


  let data = null;


  try {

    data =
      await response.json();

  } catch {

    data = null;

  }


  if (!response.ok) {

    throw new Error(
      data?.detail ||
      data?.message ||
      `Simulation request failed (${response.status})`
    );

  }


  if (!data) {

    throw new Error(
      'Backend returned an empty simulation response.'
    );

  }


  return data;

}