import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";


const BarChartMock = [
    {
        dayDate: '10/01',
        materias: [
            { materia: 'Matemática', minutos: 120 },
            { materia: 'Programação', minutos: 150 }
        ],
    },
    {
        dayDate: '11/01',
        materias: [
            { materia: 'Matemática', minutos: 120 },
            { materia: 'Física', minutos: 150 }
        ],
    },
    {
        dayDate: '12/01',
        materias: [
            { materia: 'Matemática', minutos: 120 },
            { materia: 'Física', minutos: 150 }
        ],
    },
];

const SUBJECT_COLORS: Record<string, string> = {
    'Matemática': '#8b5cf6',
    'Programação': '#06b6d4',
    'Física': '#f59e0b',
    'Inglês': '#10b981',
};

export const StudyBarChart = () => {
    // Transforma dados aninhados em formato plano para o gráfico
    const chartData = BarChartMock.map(day => {
        const dataPoint: Record<string, any> = { dayDate: day.dayDate };
        day.materias.forEach(materia => {
            dataPoint[materia.materia] = materia.minutos;
        });
        return dataPoint;
    });

    // Extrai todas as matérias únicas
    const allMaterias = Array.from(
        new Set(BarChartMock.flatMap(entry => entry.materias.map(m => m.materia)))
    );

    console.log('Chart Data:', allMaterias);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tendência Semanal</CardTitle>
                <CardDescription>Evolução dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dayDate" />
                        <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                            formatter={(value: number) => `${value} min`}
                            labelStyle={{ color: '#000' }}
                        />
                        <Legend />
                        {allMaterias.map((materia) => (
                            <Bar 
                                key={materia} 
                                dataKey={materia} 
                                fill={SUBJECT_COLORS[materia] || '#94a3b8'}
                                name={materia}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
};