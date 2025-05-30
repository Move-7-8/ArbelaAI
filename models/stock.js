import { Schema, model, models } from 'mongoose';

const stockSchema = new Schema({
  
  Stock: {
      type: String, 
  },
  Name: {
  type: String,
  },
  GICsIndustryGroup: {
    type: String,
  },
  Exchange: {
    type: String,
  },
  Price: {
    type: Schema.Types.Mixed,
  },
  LastPrice: {
    type: Schema.Types.Mixed, // Assuming last price is also a number
  },
  RegularMarketChange: {
    type: Schema.Types.Mixed,
  },
  MarketCapitalisation: {
    type: Schema.Types.Mixed, // Assuming it's a numeric value
  },
  fiftyTwoWeekHigh: {
  type: Schema.Types.Mixed, // Numeric value
  },
  fiftyTwoWeekLow: {
    type: Schema.Types.Mixed, // Numeric value
  },
  fiftyTwoWeekChangePercent: {
    type: Schema.Types.Mixed, // Percentage can be stored as a number
  },
  twoHundredDayAverageChangePercent: {
    type: Schema.Types.Mixed,
  },
  fiftyDayAverageChangePercent: {
    type: Schema.Types.Mixed,
  },
  averageDailyVolume3Month: {
    type: Schema.Types.Mixed,
  },
  regularMarketVolume: {
    type: Schema.Types.Mixed,
  },
  priceToBook: {
    type: Schema.Types.Mixed, // Stored as a formatted string as per your existing code
  },
  trailingAnnualDividendRate: {
    type: Schema.Types.Mixed,
  },
  epsTrailingTwelveMonths: {
    type: Schema.Types.Mixed,
  },
  regularMarketChangePercent: {
    type: Schema.Types.Mixed,
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  RangeVolatility: {
    type: Schema.Types.Mixed, // Stored as a formatted string as per your existing code
  },
  PercentageChangeVolatility: {
    type: Schema.Types.Mixed,
  },
  Volatility: {
    type: Schema.Types.Mixed,
  },
  Liquidity: {
    type: Schema.Types.Mixed,
  },
  VolatilityScore: {
    type: Schema.Types.Mixed,
  },
  LiquidityScore: {
    type: Schema.Types.Mixed,
  },
  historicData: [{
    date: Date,
    open: Number,
    close: Number,
    high: Number,
    low: Number,
    volume: Number,
    // Add other fields as necessary based on the API response
  }],

});

  stockSchema.index({ Stock: 1 });  // Ascending index on the 'Stock' field
  
  const Stock = models.Stock || model("Stock", stockSchema);
  
  
  export default Stock;
  