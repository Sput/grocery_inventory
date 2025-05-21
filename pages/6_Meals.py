import streamlit as st
import csv
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime

# Check for authentication status
if st.session_state.get("authentication_status") != True:
    st.error("⛔ You must log in to access this page.")
    st.stop()

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)

st.title('Meals')

# Fetch all meals from the 'meals' table
response = supabase.table("meals").select("meal").execute()

# Fetch all meals from the 'meals' table sorted by 'last_eaten' (oldest dates first)
meals = supabase.table('meals').select('meal, last_eaten').order('last_eaten').execute()

# Create a dropdown (selectbox) for meals
if response.data:
    meal_options = [item['meal'] for item in response.data]  # Extract meal names
    selected_meal = st.selectbox("Select a Meal", meal_options)  # Create dropdown
else:
    st.write("No meals found in the meals table.")


if st.button("Dinner"):
    # Get today's date
    today_date = datetime.now().date()

    # Convert date to string
    today_date_str = today_date.strftime('%Y-%m-%d')  # Format as 'YYYY-MM-DD'

    # Get the ID of the selected meal
    meal_id_response = supabase.table('meals').select('id').eq('meal', selected_meal).execute()

    if meal_id_response.data:
        meal_id = meal_id_response.data[0]['id']

        # Update the 'last_eaten' column for that meal
        update_response = supabase.table('meals').update({'last_eaten': today_date_str}).eq('id', meal_id).execute()

        if update_response.data:
            st.success(f"Marked '{selected_meal}' as eaten today.")
        else:
            st.error("Failed to update the database.")
    else:
        st.error("Could not find meal ID for the selected meal.")


    if response.data:
        st.success("Updated 'last_eaten' with today's date.")
    else:
        st.error("Failed to update 'last_eaten'.")



# Display the meals
if meals.data:
    st.subheader("Meals Sorted by Last Eaten")
    for item in meals.data:
        st.write(f"Meal: {item['meal']}, Last Eaten: {item['last_eaten']}")  # Display each meal and its last eaten date
else:
    st.write("No meals found in the meals table.")