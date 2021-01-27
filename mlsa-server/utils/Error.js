exports.Err = class Error{
    static No_Data_Err = {
        code:601,
        message: "No data to analyze was supplied",
    }
    static No_Lang_Err = {
        code:602,
        message: "No language to analyze was supplied",
    }
    static Unknown_Lang_Err = {
        code:603,
        message: "Unknown language to analyze was supplied",
    }
    static App_Still_Starting = {
        code:604,
        message: "The application is still initializing some of its features that are needed to supply this route! Please stand by and try again in a few seconds.",
    }
    static Rate_Limit = {
        code:429,
        message: "Rate-Limit was reached. Please try again in a few minutes.",
    }
}