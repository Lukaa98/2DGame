using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{

    public GameObject levelwon;
    public GameObject levelLost;

    bool won = false;
    
public void LevelWon()
{
    if(won ==false)
    {
    won = true;

               levelwon.SetActive(true);
                Debug.Log("game Won");
    }

    
}

public void LevelLost()
{
             levelLost.SetActive(true);
             Debug.Log("level los12t ");


}
}
