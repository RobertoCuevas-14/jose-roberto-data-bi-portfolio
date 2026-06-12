# ConnectaTel Customer Segmentation Analysis

## Project Objective

This project analyzes customer behavior for **ConnectaTel**, a telecommunications company operating in Latin America. The goal is to evaluate customer usage patterns, identify data quality issues, segment users based on behavior and age, and translate the findings into actionable business insights for stakeholders.

The analysis focuses on data registered up to **2024** and supports decisions related to customer segmentation, service usage, plan strategy and commercial opportunities.

## Datasets Used

The analysis uses three CSV datasets:

| Dataset | Description |
|---|---|
| `plans.csv` | Information about available plans, including price, included minutes, included GB and extra usage costs. |
| `users_latam.csv` | Customer information such as user ID, age, city, registration date, plan and churn-related attributes. |
| `usage.csv` | Historical usage records, including calls, messages, duration, length and activity type. |

## Analysis Stages

1. **Data Loading and Initial Exploration**
   - Loaded the three source datasets with `pandas`.
   - Reviewed structure, row counts, column types and initial samples.
   - Identified the main entities: plans, users and usage events.

2. **Data Quality Assessment**
   - Detected missing values across customer and usage fields.
   - Reviewed invalid sentinel values such as `-999` for age and `?` for city.
   - Identified future registration dates outside the expected 2024 business context.

3. **Data Cleaning**
   - Replaced invalid age sentinel values with the median.
   - Converted invalid city values into missing values.
   - Flagged or nullified out-of-range registration dates.
   - Evaluated missing values in `duration` and `length` based on usage type.

4. **Feature Engineering**
   - Created usage indicators for calls and text messages.
   - Aggregated customer-level metrics:
     - total messages
     - total calls
     - total call minutes
   - Combined usage metrics with customer profile data.

5. **Exploratory Data Analysis**
   - Reviewed customer distributions by age, usage level and plan.
   - Built histograms and boxplots to understand usage patterns and outliers.
   - Evaluated whether outliers should be kept or investigated further.

6. **Customer Segmentation**
   - Classified customers by usage behavior:
     - Low usage
     - Medium usage
     - High usage
   - Classified customers by age group:
     - Young
     - Adult
     - Older adult

7. **Executive Insight for Stakeholders**
   - Summarized data quality issues, customer behavior patterns and business opportunities.
   - Translated technical findings into recommendations for customer strategy and operational improvement.

## Tools and Libraries

- Python
- pandas
- matplotlib
- seaborn
- Jupyter Notebook / Google Colab

## How to Run the Notebook

### Option 1: Google Colab

1. Download the notebook file:
   `connectatel_customer_segmentation.ipynb`
2. Open [Google Colab](https://colab.research.google.com/).
3. Select **File > Upload notebook**.
4. Upload the notebook.
5. Upload the required CSV files into the Colab runtime:
   - `plans.csv`
   - `users_latam.csv`
   - `usage.csv`
6. If needed, update the file paths in the notebook from:
   `/datasets/plans.csv`
   to the location where the files were uploaded in Colab.
7. Run the notebook from top to bottom.

### Option 2: Local Jupyter Notebook

1. Install the required libraries:

```bash
pip install pandas matplotlib seaborn
```

2. Place the datasets in a local folder named `datasets`.
3. Update the file paths if necessary.
4. Open the notebook:

```bash
jupyter notebook connectatel_customer_segmentation.ipynb
```

5. Run all cells sequentially.

## Reproduction Guide

To reproduce the analysis:

1. Clone or download the project files.
2. Ensure the notebook and datasets are available in the expected folder structure.
3. Install the required Python libraries.
4. Open the notebook in Google Colab or Jupyter Notebook.
5. Run the notebook in order:
   - load datasets
   - inspect data structure
   - clean sentinel and invalid values
   - aggregate usage metrics by user
   - generate visualizations
   - create customer segments
   - review executive conclusions

## Business Value

This project demonstrates the ability to transform raw telecom usage data into a structured customer view. It connects data quality, usage behavior and segmentation to practical business questions such as:

- Which customer groups represent the highest usage?
- Which data quality issues could affect business decisions?
- How can customer behavior support plan strategy or retention actions?
- What insights should be communicated to stakeholders?

## Project Status

Applied analytics project with technical evidence available through the notebook and README documentation.
