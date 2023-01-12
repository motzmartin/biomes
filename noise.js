function noise(width, height, iterations)
{
    const arr = [];
    for (let i = 0; i < height; i++)
    {
        const line = [];
        for (let j = 0; j < width; j++)
        {
            line.push(Math.random());
        }
        arr.push(line);
    }

    for (let i = 0; i < iterations; i++)
    {
        const temp = [];
        for (let j = 0; j < height; j++)
        {
            const line = [];
            for (let k = 0; k < width; k++)
            {
                line.push(arr[j][k]);
            }
            temp.push(line);
        }

        for (let j = 0; j < height; j++)
        {
            for (let k = 0; k < width; k++)
            {
                let sum_length = 1;
                let sum = temp[j][k];
                if (k > 0)
                {
                    sum += temp[j][k - 1];
                    sum_length++;
                }
                if (j > 0)
                {
                    sum += temp[j - 1][k];
                    sum_length++;
                }
                if (k < width - 1)
                {
                    sum += temp[j][k + 1];
                    sum_length++;
                }
                if (j < height - 1)
                {
                    sum += temp[j + 1][k];
                    sum_length++;
                }
                arr[j][k] = sum / sum_length;
            }
        }
    }

    return arr;
}