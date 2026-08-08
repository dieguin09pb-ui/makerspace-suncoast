def main():
    # Program uses calls to a function which has if else chains to see if it can respond to the user based on some keywords the program can detect
    print("Hello! I'm your chatbot. How can I assist you today?")

    user_name = input("What's your name? ") # Store the name to use throughout

    print()
    print(f"Nice to meet you, {user_name}!")
    print("I can help you with weather, restaurant recommendations, sports talk, or the World Cup!")
    print("Type 'goodbye' to exit.")
    print()

    # Use chatOn to see if user wants to keep the program running
    chatOn = True
    while chatOn:
        user_input = input(f"{user_name}: ")

        # Checking both goodybe and exit so that common options are accounted for
        if user_input.lower() == "goodbye" or user_input.lower() == "exit":
            print()
            print(f"Chatbot: Goodbye, {user_name}! Have a great day!")
            chatOn = False
        else:
            response = get_response(user_input, user_name)
            print()
            print(f"Chatbot: {response}") # Print the response we got from the function
            print()


def get_response(user_input, user_name): #This is the function which actually handles whether I can respond adquetly or I am just say I can't answer that topic
    user_input = user_input.lower() # I want to make sure that case differnces don't mess up detecting whether I can respond or not

    # Added this so it can say hi back if user just wants to greet first
    if "hi" in user_input or "hello" in user_input or "hey" in user_input:
        return f"Hey {user_name}. What's up?"

    elif "weather" in user_input:
        return "Its sunny in Florida. Are you planning to do something outdoors?"
    # I use or operators to accomodate for mutiple keywords the usr could enter related to a topic to try to avoid missing a topic I have a response for
    elif "restaurant" in user_input or "food" in user_input or "eat" in user_input or "hungry" in user_input:
        # Some different restaurants to reccomend to user if they input a restaurant
        return ("What kind of food do you want? These are some recommendations I have:\n"
                "- First Watch: Great for breakfast\n"
                "- Chipotle: Quick and casual\n"
                "- Texas Roadhouse: More casual dining\n"
                "- Capital Grill: More formal")
        # If they mention a sport
    elif "sports" in user_input or "game" in user_input or "soccer" in user_input or "football" in user_input:
        return f"Do you play a sport {user_name}, or do you prefer just watching?"
        # If they mention the world cup, a trending event, I can give them some quick details
    elif "world cup" in user_input or "fifa" in user_input or "2026" in user_input:
        return f"The 2026 FIFA World Cup will be hosted by USA, Canada, and Mexico. That is all I know about it, but which team do you want to win, {user_name}?"

    else:
        # If none of the keywords match just ask them again
        return f"I don't know about that topic. Want to talk more? I can tell you about weather, restaurants, sports, or the World Cup."


main()