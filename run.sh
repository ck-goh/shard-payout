BOT_TOKEN=SUPER SECRET
CHANNEL_ID="squad:380531712440139776,fleet:380605059282763776"
docker run -d --restart=always -e BOT_TOKEN="$BOT_TOKEN" -e CHANNEL_ID="$CHANNEL_ID" \
    -v "/home/bje/projects/shard-payout/data:/src/lib/data" --name payouts shard_payouts

# CHANNEL_ID=380531712440139776   # pvp
# docker run -d --restart=always -e BOT_TOKEN="$BOT_TOKEN" -e CHANNEL_ID="$CHANNEL_ID" \
    # -v "/home/bje/projects/shard-payout/data/squad:/src/lib/data" --name squad-shard shard_payouts

# CHANNEL_ID=380605059282763776   # fleet
# docker run -d --restart=always -e BOT_TOKEN="$BOT_TOKEN" -e CHANNEL_ID="$CHANNEL_ID" \
    # -v "/home/bje/projects/shard-payout/data/fleet:/src/lib/data" --name fleet-shard shard_payouts
